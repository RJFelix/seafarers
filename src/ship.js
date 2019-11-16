import Konva from 'konva'
import { Point, Vector, Line, Segment } from '@flatten-js/core'
import uuid from 'uuid/v4'

import itemTemplates from './item-templates.js'
import producerTemplates from './producer-templates.js'
import { randomInt, groupBy } from './utils.js'
import /*Item,*/ { createItemFromProducer, createRandomItem, createItemFromTemplate} from './item.js'

const referenceVector = new Vector(
    new Point(0, 0),
    new Point(0, -1)
)

const degreesToRadians = degrees => degrees * (Math.PI / 180)
const radiansToDegrees = radians => radians * (180 / Math.PI)

const removeAllChildren = (element) => {
    if (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }   
}

export default class Ship {
    constructor({ x, y, cargoHoldVolume }) {
        this.position = new Point(x, y)
        this.path = new Vector(
            new Point(0, 0),
            this.position
        )
        this.speed = 0

        this.currentDestination = null

        this.shape = [
            {
                x: 0,
                y: 0,
            },
            {
                x: -5,
                y: 15,
            },
            {
                x: 5,
                y: 15,
            }
        ]
        this.view = new Konva.Rect({
            x: 0,
            y: 0,
            width: 30,
            height: 10,
            offsetX: 15,
            offsetY: 5,
            fill: 'red'
        })

        this.cargo = []
        this.cargoHoldVolume = cargoHoldVolume || 30000

        // Currently, the cargo hold can pack items in perfectly with no wasted space at all between items
        // as if it were melting items down into a liquid and storing them in a tank. Doubloons, for instance,
        // are coins that waste space in the real world due to their cylindrical shape. But the cargo hold
        // saves that space.

        const manifestDiv = document.getElementById('shipManifest')
        document.addEventListener('keypress', (event) => {
            if (event.key === 's') {
                if (this.location && this.location.producer) {
                    const itemFromLocation = createItemFromProducer(this.location.producer)
                    const didAddItem = this.addCargo(itemFromLocation)
                    if (didAddItem) {
                        // add a line to the cargo manifest in the HTML document
                        const itemListingElement = document.createElement('p')
                        const itemText = `Bought from ${this.location.name}: ${itemFromLocation.name} made by ${itemFromLocation.madeBy}: ${itemFromLocation.volume} m3 - ${itemFromLocation.weight}kg - $${itemFromLocation.value} - ${itemFromLocation.rarity} rarity`
                        itemListingElement.textContent = itemText
                        manifestDiv.appendChild(itemListingElement)
                    } else {
                        alert('Cargo hold full!')
                    }
                }
            }
        })
    }
    getView() {
        return this.view
    }

    addCargo(item) {
        // Check to make sure there's room
        //   If the sum of this.cargo's volume properties + item.volume <= this.cargoHoldItem => there's room
        const sumFunction = (sum, item) => sum + item.volume
        const currentVolume = this.cargo.reduce(sumFunction, 0)

        const volumeWithNewItem = currentVolume + item.volume

        if (volumeWithNewItem <= this.cargoHoldVolume) {
            // If there's room, add it to this ship's cargo and return true
            this.cargo.push(item)
            this.groupShipInventory()
            return true
        } else {
            // If not, return false
            return false
        }
    }
    // OLD SELL CARGO FUNCTION:
    // sellCargo(item) {
    //     const index = this.cargo.findIndex((cargoItem) => cargoItem.id === item.id)
    //     if (index > -1) {
    //         this.cargo.splice(index, 1)
    //         const payment = createItemFromProducer(producerTemplates[3], itemTemplates[3])
    //         this.addCargo(payment)
    //         return true
    //     }
    //     return false
    // }
    sellCargo(item) {
        const index = this.cargo.findIndex((cargoItem) => cargoItem.id === item.id)
        if (index > -1) {
            const payment = this.getPaymentFromValue(item.value)
            this.cargo.splice(index, 1)
            this.addCargo(payment)
            return true
        }
        return false
    }

    getPaymentFromValue(value) {
        const payment = createItemFromProducer(producerTemplates[3], itemTemplates[3])

        payment.weight *= value
        payment.volume *= value
        payment.value *= value
        payment.quantity *= value

        return payment
    }

    reachedDestination() {
        this.location = this.currentDestination
        this.location.refillMarket()

        const locationInfoEl = document.getElementById('locationInfo')
        removeAllChildren(locationInfoEl)

        this.location.market.forEach((item) => {
            const itemEl = document.createElement('div')
            const itemDescriptionEl = document.createElement('p')
            itemDescriptionEl.innerText = `${item.name} made by ${item.madeBy} - $${item.value} - rarity ${item.rarity} - ${item.weight} kg - ${item.volume} m3`
            itemEl.appendChild(itemDescriptionEl)
            const itemBuyButton = document.createElement('button')
            itemBuyButton.innerText = 'Buy'
            itemBuyButton.addEventListener('click', (evt) => {
                if (this.addCargo(item)) {
                    const index = this.location.market.findIndex((marketItem) => marketItem.id === item.id)
                    this.location.market.splice(index, 1)
                    locationInfoEl.removeChild(itemEl)
                } else {
                    alert('Cannot buy; cargo hold full!')
                }
            })
            itemEl.appendChild(itemBuyButton)
            locationInfoEl.appendChild(itemEl)
        })

        this.currentDestination = null
        this.speed = 0
    }

    openShipInventory() {

        const shipInventoryEl = document.getElementById('shipInventory')
        removeAllChildren(shipInventoryEl)

        this.cargo.forEach((item) => {
            const itemEl = document.createElement('div')
            const itemDescriptionEl = document.createElement('p')
            itemDescriptionEl.innerText = `${item.quantity}x ${item.name} made by ${item.madeBy}: - $${item.value} - rarity ${item.rarity} - ${item.weight} kg - ${item.volume} m3`
            itemEl.appendChild(itemDescriptionEl)
            const itemSellButton = document.createElement('button')
            itemSellButton.innerText = 'Sell'
            itemSellButton.addEventListener('click', (evt) => {
                if (!this.sellCargo(item)) {
                    alert('Cannot sell; cargo hold empty!')
                }
            })
            itemEl.appendChild(itemSellButton)
            shipInventoryEl.appendChild(itemEl)
        })
    }

    groupShipInventory() {
        // We are assuming that the two items here are already valid items
        // combineItems should take two items, and return the combination of the two
        const combineItems = (alreadyCombinedItem, newItem) => {
            // We have to consider the case of alreadyCombinedItem = null
            if (!alreadyCombinedItem) {
                if (Array.isArray(newItem.madeBy)) {
                    return newItem
                }
                const item = {
                    ...newItem,
                    madeBy: [newItem.madeBy]
                }
                return item
            }
            let madeBy = []
            if (Array.isArray(alreadyCombinedItem.madeBy)) {
                madeBy = [newItem.madeBy].concat(alreadyCombinedItem.madeBy)
            } else {
                madeBy = [alreadyCombinedItem.madeBy, newItem.madeBy]
            }
            // Trick to shallow de-duplicate an array
            const madeBySet = new Set(madeBy)
            madeBy = Array.from(madeBySet)
            
            const item = {
                id: uuid(),
                weight: alreadyCombinedItem.weight + newItem.weight,
                volume: alreadyCombinedItem.volume + newItem.volume,
                value: alreadyCombinedItem.value + newItem.value,
                rarity: newItem.rarity,
                quantity: alreadyCombinedItem.quantity + newItem.quantity,
                name: newItem.name,
                madeBy
            }
            return item
        }
        this.cargo = groupBy(this.cargo, ["name", "rarity"], combineItems)
        this.openShipInventory()
    }

    setDestination(destination) {
        this.location = null
        const locationInfoEl = document.getElementById('locationInfo')
        removeAllChildren(locationInfoEl)
        this.currentDestination = destination
        this.speed = 1
        this.path = new Vector(
            this.position,
            destination.position
        )
    }

    update() {
        if (this.currentDestination) {
            const velocity = this.path.normalize().multiply(this.speed)
            this.position = this.position.translate(velocity)
            this.angle = referenceVector.angleTo(this.path)

            // const destination = this.destinations[this.currentDestinationIndex]
            const destination = this.currentDestination
            if (Math.round(this.position.x) === Math.round(destination.position.x) && Math.round(this.position.y) === Math.round(destination.position.y)) {
                this.reachedDestination()
            }

            this.view.position({
                x: this.position.x,
                y: this.position.y
            })
            this.view.rotation(radiansToDegrees(this.angle) + 90)
        }
    }
}