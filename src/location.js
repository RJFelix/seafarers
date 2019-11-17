import Konva from 'konva'
import { Point } from '@flatten-js/core'
import { createItemFromProducer } from './item.js'
import uuid from 'uuid/v4'

export default class Location {
  constructor( { name, x, y, producer } ) {
      this.id = uuid()
      this.name = name
      this.market = []
      this.position = new Point(x, y)
      this.color = 'rgb(0,0,0)'
      this.producer = producer
      this.onSelectListeners = []

      this.onClick = this.onClick.bind(this)
  }

  onClick() {
    console.log(`Click location ${this.name}`)
    this.onSelectListeners.forEach(listener => listener())
  }

  getView() {
      return this.view
  }

  refillMarket() {
    if (this.producer) {
      const newItems = new Array(5).fill(0).map(() => createItemFromProducer(this.producer))
      this.market = this.market.concat(newItems)
    }
  }

  getItemValue(item) {
      // calculates the item's value at this location
      // returns it
  }

  selected(cb) {
      this.onSelectListeners.push(cb)
  }
}