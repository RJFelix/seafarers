import Konva from 'konva'
import { Point, Vector, Line, Segment } from '@flatten-js/core'

const referenceVector = new Vector(
    new Point(0, 0),
    new Point(0, -1)
)

const degreesToRadians = degrees => degrees * (Math.PI / 180)
const radiansToDegrees = radians => radians * (180 / Math.PI)

class shipAttributes {

}

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

let bagOfTea = {
    weight: 50,
    stackSize: 7,
    value: 100,
    rarity: 0
}

const randomInt = (min, max) => min + Math.floor(Math.random() * max)

export const createRandomItem = (name) => {
    const weightVal = randomInt(10, 100)
    const volumeVal = randomInt(1, 10)
    const valueVal = randomInt(10, 5000)
    const rarityVal = randomInt(0, 10)
    const item = {
        weight: weightVal,
        volume: volumeVal,
        value: valueVal,
        rarity: rarityVal,
        name: name
    }
    return item
}

export default class Ship {
    constructor({ x, y, cargoHoldVolume }) {
        this.position = new Point(x, y)
        this.path = new Vector(
            new Point(0, 0),
            this.position
        )
        this.speed = 1

        this.destinations = []
        this.currentDestinationIndex = 0

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

    addDestination(location) {
        this.destinations.push(location)
        if (this.destinations.length === 1) {
            this.path = new Vector(
                this.position,
                location.position
            )
        }
    }
    nextDestination() {
        this.currentDestinationIndex += 1
        if (this.currentDestinationIndex >= this.destinations.length) {
            this.currentDestinationIndex = 0
        }
        this.path = new Vector(
            this.position,
            this.destinations[this.currentDestinationIndex].position
        )
    }
    update() {
        const velocity = this.path.normalize().multiply(this.speed)
        this.position = this.position.translate(velocity)
        this.angle = referenceVector.angleTo(this.path)

        const destination = this.destinations[this.currentDestinationIndex]
        if (Math.round(this.position.x) === Math.round(destination.position.x) && Math.round(this.position.y) === Math.round(destination.position.y)) {
            this.nextDestination()
        }

        this.view.position({
            x: this.position.x,
            y: this.position.y
        })
        this.view.rotation(radiansToDegrees(this.angle) + 90)
    }
}