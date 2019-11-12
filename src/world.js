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
        window.addEventListener('keypress', evt => {
            if (evt.key === 'a') {
                const randomItem = createRandomItem('Cargo')
                const didAddItem = this.ship.addCargo(randomItem)
                if (didAddItem) {
                    // add a line to the cargo manifest in the HTML document
                    const itemListingElement = document.createElement('p')
                    const itemText = `Added to Inventory: ${randomItem.name} made by ${randomItem.madeBy}: ${randomItem.volume} liters - ${randomItem.weight}kg - $${randomItem.value} - ${randomItem.rarity} rarity`
                    itemListingElement.textContent = itemText
                    manifestDiv.appendChild(itemListingElement)
                } else {
                    alert('Cargo hold full!')
                }
            }
        })
    }
    getView() {
        return this.view
    }
    update() {
        this.ship.update()
    }
}