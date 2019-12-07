import Konva from 'konva'
import { Point } from '@flatten-js/core'
import { createItemFromProducer, combineItems } from './item.js'
import { groupBy } from './utils.js'
import uuid from 'uuid/v4'
import { randomInt, normalDistribution, factorialize } from './utils.js'
import demandTemplate from './demand-template.js'
import itemTemplates from './item-templates.js'

//import { makeAMap } from './map-matrix.js'

export default class Location {
  constructor( { name, x, y, producer, population } ) {
      this.id = uuid()
      this.name = name
      this.market = []
      this.position = new Point(x, y)
      this.color = 'rgb(0,0,0)'
      this.producer = producer
      this.population = population
      this.onSelectListeners = []
      this.buyPriceMultiplier = 99
      this.sellPriceMultiplier = 101

      this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.onSelectListeners.forEach(listener => listener())
  }

  addPrices(market) {
    const presentItems = new Set()
    const marketWithPrices = market.map(item => {
      presentItems.add(item.name)
      const itemQuantity = item.quantity
      const itemDemandTemplate = demandTemplate[item.itemTemplateIndex]
      const fractionOfDemand = itemQuantity / (itemDemandTemplate.demand * this.population)
      const demandValue = 3 * (Math.pow(0.5, fractionOfDemand))
      const buyPriceMultiplier = normalDistribution(80, 99, 1)
      const sellPriceMultiplier = normalDistribution(101, 120, 1)
      return {
        ...item,
        buyPrice: Math.round(item.value * demandValue * (buyPriceMultiplier/100)),
        sellPrice: Math.round(item.value * demandValue * (sellPriceMultiplier/100))
      }
    })
    return marketWithPrices
  }

  priceMultiplierChanger(location) {
    const buyPriceMultiplier = normalDistribution(80, 99, 1)
    const sellPriceMultiplier = normalDistribution(101, 120, 1)

    if (buyPriceMultiplier > location.buyPriceMultiplier){
      location.buyPriceMultiplier = location.buyPriceMultiplier + (buyPriceMultiplier*(1/100)*(1/100))
    } else {
      location.buyPriceMultiplier = location.buyPriceMultiplier - (buyPriceMultiplier*(1/100)*(1/100))
    }
    
    if (sellPriceMultiplier > location.sellPriceMultiplier){
      location.sellPriceMultiplier = location.sellPriceMultiplier + (sellPriceMultiplier*(1/100)*(1/100))
    } else {
      location.sellPriceMultiplier = location.sellPriceMultiplier - (sellPriceMultiplier*(1/100)*(1/100))
    }
  }

  refillMarket() {
    const roll = normalDistribution(1, 100, 1)
    for (var i = roll; i>0; i-- ) {
      if (this.producer) {
        /* Before making this.producer an array */
        // const newItems = new Array(5).fill(0).map(() => createItemFromProducer(this.producer))

        const newItems = this.producer.map(n => createItemFromProducer(n))
        this.market = this.addPrices(groupBy(this.market.concat(newItems), ["name", "rarity"], combineItems))
      }
    }
  }

  regroupItems() {
    this.market = groupBy(this.market, ["name", "rarity"], combineItems).filter(item => item.quantity > 0)
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