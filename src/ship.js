import Konva from 'konva'
import { Point, Vector, Line, Segment } from '@flatten-js/core'
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
        this.cargoHoldVolume = cargoHoldVolume || 300

        const manifestDiv = document.getElementById('shipManifest')
        document.addEventListener('keypress', (event) => {
            if (event.key === 's') {
                if (this.location && this.location.producer) {
                    const itemFromLocation = createItemFromProducer(this.location.producer)
                    const didAddItem = this.addCargo(itemFromLocation)
                    if (didAddItem) {
                        // add a line to the cargo manifest in the HTML document
                        const itemListingElement = document.createElement('p')
                        const itemText = `Bought from ${this.location.name}: ${itemFromLocation.name} made by ${itemFromLocation.madeBy}: ${itemFromLocation.volume} liters - ${itemFromLocation.weight}kg - $${itemFromLocation.value} - ${itemFromLocation.rarity} rarity`
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
            return true
        } else {
            // If not, return false
            return false
        }
    }
    sellCargo(indexID) {
        if (this.cargo[indexID] != undefined) {
            this.cargo.splice(indexID, 1)
            const payment = createItemFromProducer(producerTemplates[3], itemTemplates[3])
            this.addCargo(payment)
            console.log("sold at sellCargo")
            return true
        }
        console.log("returned false")
        return false
    }

    reachedDestination() {
        this.location = this.currentDestination
        this.location.refillMarket()

        const locationInfoEl = document.getElementById('locationInfo')
        removeAllChildren(locationInfoEl)

        this.location.market.forEach((item, idx) => {
            const itemEl = document.createElement('div')
            const itemDescriptionEl = document.createElement('p')
            itemDescriptionEl.innerText = `${item.name} made by ${item.madeBy} - $${item.value} - rarity ${item.rarity} - ${item.weight} kg - ${item.volume} liters`
            itemEl.appendChild(itemDescriptionEl)
            const itemBuyButton = document.createElement('button')
            itemBuyButton.innerText = 'Buy'
            itemBuyButton.addEventListener('click', (evt) => {
                if (this.addCargo(item)) {
                    this.location.market.splice(idx, 1)
                    locationInfoEl.removeChild(itemEl)
                    this.openShipInventory()
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

        this.cargo.forEach((item, idx) => {
            const itemEl = document.createElement('div')
            const itemDescriptionEl = document.createElement('p')
            itemDescriptionEl.innerText = `${item.name} made by ${item.madeBy}: - $${item.value} - rarity ${item.rarity} - ${item.weight} kg - ${item.volume} liters`
            itemEl.appendChild(itemDescriptionEl)
            const itemSellButton = document.createElement('button')
            itemSellButton.innerText = 'Sell'
            itemSellButton.addEventListener('click', (evt) => {
                if (this.sellCargo(idx)) {
                    shipInventoryEl.removeChild(itemEl)
                    this.openShipInventory()
                }
                else {
                    alert('Cannot sell; cargo hold empty!')
                }
            })
            itemEl.appendChild(itemSellButton)
            shipInventoryEl.appendChild(itemEl)
        })
    }

    groupShipInventory() {
        const sortedStuff = groupBy(this.cargo, itemTemplates.template.name)
        console.log(sortedStuff)
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
            // // this.groupShipInventory()
            // console.log(this.cargo.weight)
            // // console.log(Object.values(this.cargo))
            // // console.log(this.cargo.find("Cannonball"))
            // this.openShipInventory()
        }
    }
}