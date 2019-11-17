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
        this.locations.forEach(location => {
            location.selected(() => {
                this.ship.setDestination(location)
            })
        })

        this.view = new Konva.Group({
            x: 0,
            y: 0
        })

        this.locations.forEach(location => {
            this.view.add(location.getView())
        })

        this.view.add(this.ship.getView())

        const manifestDiv = document.getElementById('shipManifest')
    }
    getView() {
        return this.view
    }
    update() {
        this.ship.update()
    }
}