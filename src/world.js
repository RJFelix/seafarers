import Konva from 'konva'
import { Point, Vector, Line, Segment } from '@flatten-js/core'

import Ship from './ship.js'
import producers from './producer-templates.js'
import { createRandomItem } from './item.js'
import locationData from './location-data.js'
import Location from './location.js'

export default class World {
    constructor() {
        this.name = ''
        this.locations = locationData
        this.ship = new Ship({ x: 0, y: 0 })
        this.ship.createShipType(0)
        this.locations.forEach(location => {
            location.selected(() => {
                this.ship.setDestination(location)
            })
        })
    }
    update(currentGameTime) {

        // this.ship.update(currentGameTime)
    }
    updateGame(currentGameTime) {
        this.ship.update(currentGameTime)
    }
}