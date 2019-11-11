import Konva from 'konva'
import { Point, Vector, Line, Segment } from '@flatten-js/core'

import Ship, { createRandomItem, createRandomProducer } from './ship.js'

class Location {
    constructor( { name, x, y } ) {
        this.name = name
        this.position = new Point(x, y)
        this.color = 'rgb(0,0,0)'

        this.view = new Konva.Group({
            x: this.position.x,
            y: this.position.y,
            rotation: 0
        })

        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 10,
            height: 10,
            fill: 'green',
            stroke: 'black'
        })

        this.text = new Konva.Text({
            x: 15,
            y: 0,
            text: this.name
        })

        this.onSelectListeners = []

        this.view.add(this.rect)
        this.view.add(this.text)
        this.view.on('mouseenter', () => {
            this.rect.fill('yellow')
        })
        this.view.on('click', () => {
            this.onSelectListeners.forEach(listener => listener())
        })
        this.view.on('mouseleave', () => {
            this.rect.fill('green')
        })
    }

    getView() {
        return this.view
    }

    getItemValue(item) {
        // calculates the item's value at this location
        // returns it
    }

    selected(cb) {
        this.onSelectListeners.push(cb)
    }
}

const locationData = [
    new Location({
        name: 'Naples',
        x: 75,
        y: 51
    }),
    new Location({
        name: 'Venice',
        x: 94,
        y: 200
    }),
    new Location({
        name: 'Alexandria',
        x: 241,
        y: 197
    }),
    new Location({
        name: 'Shanghai',
        x: 400,
        y: 400
    })
]

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