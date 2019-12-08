import Konva from 'konva'
import { Point } from '@flatten-js/core'
import { createItemFromProducer, combineItems } from './item.js'
import { groupBy } from './utils.js'
import uuid from 'uuid/v4'
import { randomInt, normalDistribution, factorialize } from './utils.js'
import demandTemplate from './demand-template.js'
import itemTemplates from './item-templates.js'
import producerTemplates from './producer-templates.js'
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
      this.buyPriceMultiplier = normalDistribution(80, 99, 1)
      this.targetBuyPriceMultiplier = normalDistribution(80, 99, 1)
      this.sellPriceMultiplier = normalDistribution(101, 120, 1)
      this.targetSellPriceMultiplier = normalDistribution(101, 120, 1)

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
      const fractionOfDemand = itemQuantity / (itemDemandTemplate.demand)
      const demandValue = 3 * (Math.pow(0.5, fractionOfDemand))
      const naturalPrice = item.value * demandValue
      const minimumPrice = item.baseValue * factorialize(item.rarity) * item.quantity
      const actualBuyPrice = Math.max(naturalPrice, minimumPrice) * this.buyPriceMultiplier/100
      const actualSellPrice = Math.max(naturalPrice, minimumPrice) * this.sellPriceMultiplier/100
      return {
        ...item,
        buyPrice: Math.round(actualBuyPrice),
        sellPrice: Math.round(actualSellPrice)
      }
    })
    return marketWithPrices
  }

  priceMultiplierChanger() {
    if (Math.round(this.targetBuyPriceMultiplier) === Math.round(this.buyPriceMultiplier)) {
      this.targetBuyPriceMultiplier = normalDistribution(80, 99, 1)
    } else {
      if (this.targetBuyPriceMultiplier > this.buyPriceMultiplier) {
        this.buyPriceMultiplier += 0.1
      } else {
        this.buyPriceMultiplier -= 0.1
      }
    }

    if (Math.round(this.targetSellPriceMultiplier) === Math.round(this.sellPriceMultiplier)) {
      this.targetSellPriceMultiplier = normalDistribution(101, 120, 1)
    } else {
      if (this.targetSellPriceMultiplier > this.sellPriceMultiplier) {
        this.sellPriceMultiplier += 0.1
      } else {
        this.sellPriceMultiplier -= 0.1
      }
    }
  }

  consumeItems() {
    this.market.forEach(item => {
      const itemDemandTemplate = demandTemplate[item.itemTemplateIndex]
        if (item.quantity >= 1) {
          item.quantity -= Math.ceil(itemDemandTemplate.demand/100)
        }
      })
      console.log(this.market[0] && this.market[0].quantity)
  }

  refillMarket() {
      if (this.producer) {
        this.market = this.market.map(item => {
          if (item.quantity > demandTemplate[item.itemTemplateIndex].demand * 10) {
            item.quantity = demandTemplate[item.itemTemplateIndex].demand * 10
          }
          return item
        })
        const newItems = this.producer.map(n => createItemFromProducer(n))
        this.market = this.addPrices(groupBy(this.market.concat(newItems), ["name", "rarity"], combineItems))
        
        
        const nonProducedItems = producerTemplates.map(n => createItemFromProducer(n)).filter(() => Math.random() < 0.5)
        this.market = this.addPrices(groupBy(this.market.concat(nonProducedItems), ["name", "rarity"], combineItems))
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