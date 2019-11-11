import Konva from 'konva'
import { Point, Vector, Line, Segment } from '@flatten-js/core'
import itemTemplates from './item-templates.js'

const referenceVector = new Vector(
    new Point(0, 0),
    new Point(0, -1)
)

const degreesToRadians = degrees => degrees * (Math.PI / 180)
const radiansToDegrees = radians => radians * (180 / Math.PI)

class shipInventory {
    constructor ( { compartmentArray, componentArray} ) {

    }
}

class Item {
    constructor ( { itemCharacteristics } ) {
    }
        

    create() {

    }
    itemCreator( {Item, Creator} ) {
        if (Item.characteristic.rarity == 0) {
            
        }
    }
}

const randomInt = (min, max) => min + Math.floor(Math.random() * max)

const createRandomItemValues = (name) => {
    const weight = randomInt(10, 100)
    const volume = randomInt(1, 10)
    const value = randomInt(10, 5000)
    const rarity = randomInt(0, 10)
    const item = {
        weight,
        volume,
        value,
        rarity,
        name: name || ''
    }
    return item
}

const createItemFromTemplate = (itemTemplate) => {
    const randomItem = createRandomItemValues(itemTemplate.name)
    // ...object "spreads" an object's entries (key-value pairs)
    // newObject = { ...oldObject } therefore takes all of the entries in oldObject and duplicates them in newObject,
    //   i.e. creates a clone of oldObject
    // newObject = { ...oldObject, ...anotherObject } - "spreads" from left to right, so first duplicate all the entries in oldObject
    //   into newObject, then duplicate all the entries in anotherObject into newObject, replacing any existing entries (from oldObject)
    //   that share the same key.
    const item = { ...randomItem, ...itemTemplate }
    return item
}

export const createRandomItem = () => {
    const itemTemplateIndex = randomInt(0, itemTemplates.length)
    const itemTemplate = itemTemplates[itemTemplateIndex]
    const randomItem = createItemFromTemplate(itemTemplate)
    return randomItem
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
        this.cargoHoldVolume = cargoHoldVolume || 30
    }
    getView() {
        return this.view
    }

    /*
    const item = {
        weight: weightVal,
        volume: volumeVal,
        value: valueVal,
        rarity: rarityVal,
        name: name,
    }
    */
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
    reachedDestination() {
        this.speed = 0
    }
    setDestination(destination) {
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