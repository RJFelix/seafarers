import Konva from 'konva'
import { Point } from '@flatten-js/core'
import { createItemFromProducer, combineItems } from './item.js'
import { groupBy } from './utils.js'
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
    this.onSelectListeners.forEach(listener => listener())
  }

  refillMarket() {
    if (this.producer) {
      const newItems = new Array(5).fill(0).map(() => createItemFromProducer(this.producer))
      this.market = groupBy(this.market.concat(newItems), ["name", "rarity"], combineItems)
    }
  }

  getItemValue(item) {
      // calculates the item's value at this location
      // returns it
  }

  buyItem(item) {
      const itemIndex = this.market.findIndex(marketItem => marketItem.id === item.id)
      if (itemIndex >= 0) {
          this.market.splice(itemIndex, 1)
      } else {
          console.error('Tried to buy an item that was not in the market!')
      }
  }

  selected(cb) {
      this.onSelectListeners.push(cb)
  }
}