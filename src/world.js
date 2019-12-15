import Konva from 'konva'
import { Point, Vector, Line, Segment } from '@flatten-js/core'

import Ship from './ship.js'
import producers from './producer-templates.js'
import { createRandomItem } from './item.js'
import locationData from './location-data.js'
import Location from './location.js'

import Market from './new-inventory/market.js'

const GAME_SPEEDS = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5, 7, 10, 15, 20, 25, 30, 40, 50]

export default class World {
    constructor() {
        this.gameTime = 0
        this.gameSpeed = 1
        this.currentSpeedIndex = 3
        this.elapsedTime = 0
        this.timeListeners = []
        this.name = ''
        this.locations = locationData
        this.ship = new Ship({ x: 0, y: 0 })
        this.ship.createShipType(0)
        this.locations.forEach(location => {
            location.selected(() => {
                this.ship.setDestination(location)
            })
        })

        this.newMarkets = this.locations.map(location => {
            return new Market(location.name.toLowerCase())
        })

        window.addEventListener('keypress', evt => {
            if (evt.key === '+') {
                if (this.currentSpeedIndex === GAME_SPEEDS.length - 1) {
                    return
                }
                this.currentSpeedIndex++
                this.gameSpeed = GAME_SPEEDS[this.currentSpeedIndex]
                this.notifyOfTime()
            } else if (evt.key === '-') {
                if (this.currentSpeedIndex === 0) {
                    return
                }
                this.currentSpeedIndex--
                this.gameSpeed = GAME_SPEEDS[this.currentSpeedIndex]
                this.notifyOfTime()
            }
        })
    }
    update(duration) {
        if (!duration) {
            return
        }
        this.elapsedTime += duration
        if (this.gameSpeed > 0 && this.elapsedTime >= (1000 * 1 / this.gameSpeed)) {
            this.gameTime++
            this.elapsedTime = 0
            this.notifyOfTime()
            this.updateGame(this.gameTime)
        }
        const fractionOfDay = duration * this.gameSpeed / 1000
        this.ship.update(fractionOfDay)
    }
    updateGame(currentGameTime) {
        this.locations.forEach(location => {
            location.priceMultiplierChanger()
            location.consumeItems()
            location.market = location.addPrices(location.market)
            location.refillMarket()            
        })

        this.newMarkets.forEach(market => {
            market.updateGame()
        })

    }

    updatePath(newPath) {
        this.ship.setPath(newPath)
    }

    notifyOfTime() {
        this.timeListeners.forEach(timeListener => timeListener({
            time: this.gameTime,
            speed: this.gameSpeed
        }))
    }

    onNewTime(listener) {
        this.timeListeners.push(listener)
    }
}