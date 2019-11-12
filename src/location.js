import Konva from 'konva'
import { Point } from '@flatten-js/core'
import { createItemFromProducer } from './item.js'

export default class Location {
  constructor( { name, x, y, producer } ) {
      this.name = name
      this.market = []
      this.position = new Point(x, y)
      this.color = 'rgb(0,0,0)'
      this.producer = producer

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