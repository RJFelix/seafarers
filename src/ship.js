import Konva from 'konva'
import { Point, Vector, Line, Segment } from '@flatten-js/core'
import uuid from 'uuid/v4'

import itemTemplates from './item-templates.js'
import producerTemplates from './producer-templates.js'
import { groupBy, radiansToDegrees, degreesToRadians } from './utils.js'
import /*Item,*/ { createItemFromProducer, createRandomItem, createItemFromTemplate, combineItems } from './item.js'
import shipTemplate from './ship-templates.js'

const referenceVector = new Vector(
    new Point(0, 0),
    new Point(0, 1)
)

export default class Ship {
    constructor({ x, y, cargoHoldVolume }) {
        this.position = new Point(x, y)
        this.path = new Vector(
            new Point(0, 0),
            this.position
        )
        this.speed = 0

        this.currentDestination = null

        this.cargo = []
        //Give Starting Cash
        this.cargo.push(this.getPaymentFromValue(10000))
        this.cargoHoldVolume = cargoHoldVolume || 30000

        this.onReachedDestinationListeners = []

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
        const payment = createItemFromProducer(producerTemplates[0], itemTemplates[0])
        payment.quantity = value
        payment.weight *= value
        payment.volume *= value
        payment.value *= value

        return payment
    }

    reachedDestination() {
        this.usePath = false
        if (this.currentDestination) {
            this.location = this.currentDestination
            this.location.refillMarket()

            this.currentDestination = null
            this.speed = 0

            this.onReachedDestinationListeners.forEach(listener => listener(this.location))
        }
    }

    groupShipInventory() {
        // We are assuming that the two items here are already valid items
        // combineItems should take two items, and return the combination of the two
        
        this.cargo = groupBy(this.cargo, ["name", "rarity"], combineItems)
    }

    setDestination(destination) {
        this.usePath = false
        this.location = null
        this.currentDestination = destination
        this.speed = 1
        this.path = new Vector(
            this.position,
            destination.position
        )
    }

    setPath(newPath) {
        this.usePath = true
        this.location = null
        this.currentPath = newPath
        this.speed = 1
        this.currentLocationIndex = 0
    }

    update(currentGameTime) {
        if (this.usePath) {
            const currentPosition = this.currentPath[this.currentLocationIndex]
            this.currentLocationIndex++
            const nextPosition = this.currentPath[this.currentLocationIndex]
            if (!nextPosition) {
                return this.reachedDestination()
            }
            const currentPoint = new Point(currentPosition.x, currentPosition.y)
            const nextPoint = new Point(nextPosition.x, nextPosition.y)
            const path = new Vector(currentPoint, nextPoint)
            this.angle = referenceVector.angleTo(path) + degreesToRadians(90)
            this.position = nextPoint 
        }
        if (this.currentDestination) {
            const velocity = this.path.normalize().multiply(this.speed)
            this.position = this.position.translate(velocity)
            this.angle = referenceVector.angleTo(this.path) + degreesToRadians(90)

            const destination = this.currentDestination
            if (Math.round(this.position.x) === Math.round(destination.position.x) && Math.round(this.position.y) === Math.round(destination.position.y)) {
                this.reachedDestination()
            }
        }
    }

    onReachedDestination(listener) {
        this.onReachedDestinationListeners.push(listener)
    }

    createShipType(index) {
        this.type = shipTemplate[index]
    }
}