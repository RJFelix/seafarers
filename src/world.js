import Konva from 'konva'
import { Point, Vector, Line, Segment } from '@flatten-js/core'

const referenceVector = new Vector(
    new Point(0, 0),
    new Point(0, -1)
)

const degreesToRadians = degrees => degrees * (Math.PI / 180)
const radiansToDegrees = radians => radians * (180 / Math.PI)

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

        this.view.add(this.rect)
        this.view.add(this.text)
    }

    getView() {
        return this.view
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
    })
]

class Ship {
    constructor({ x, y }) {
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
    }
    getView() {
        return this.view
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

export default class World {
    constructor() {
        this.name = ''
        this.locations = locationData
        this.ship = new Ship({ x: 0, y: 0 })
        this.locations.forEach(location => {
            this.ship.addDestination(location)
        })

        this.view = new Konva.Group({
            x: 0,
            y: 0
        })

        this.locations.forEach(location => {
            this.view.add(location.getView())
        })

        this.view.add(this.ship.getView())
    }
    getView() {
        return this.view
    }
    update() {
        this.ship.update()
    }
}