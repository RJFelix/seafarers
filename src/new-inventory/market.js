import ITEMS from '../data/items.js'
import MARKETS from '../data/markets.js'
import Inventory from './inventory.js'
import { randomInt, normalDistribution, factorialize } from '../utils.js'

export default class Market {
  constructor(locationName) {
    this.locationName = locationName
    this.itemData = {}
    this.inventory = new Inventory()
    this.production = MARKETS[locationName].produces

    this.buyPriceMultiplier = normalDistribution(80, 99, 1)
    this.targetBuyPriceMultiplier = normalDistribution(80, 99, 1)
    this.sellPriceMultiplier = normalDistribution(101, 120, 1)
    this.targetSellPriceMultiplier = normalDistribution(101, 120, 1)

    for (let itemKey in ITEMS) {
      const itemData = ITEMS[itemKey]
      this.itemData[itemKey] = {}
      this.itemData[itemKey].types = {}
      this.itemData[itemKey].demand = itemData.demand
      for (let typeKey in itemData.types) {
        const typeData = itemData.types[typeKey]
        this.itemData[itemKey].types[typeKey] = typeData
        this.itemData[itemKey].types[typeKey].buyPrice = 1
        this.itemData[itemKey].types[typeKey].sellPrice = 1
      }
    }

    this._updatePrices()
  }

  updateGame() {
    this._updatePrices()
    this._updatePriceMultipliers()
    this._consumeItems()
    this._produceItems()
  }

  buyItemFrom(itemName, type, quantity) {
    const numberBought = this.inventory.removeItems(itemName, type, quantity)
    const totalBuyPrice = totalPriceToBuyItem(itemName, type, quantity)
    this._updatePrices()
    return totalBuyPrice
  }

  sellItemTo(itemName, type, quantity) {
    this.inventory.addItems(itemName, type, quantity)
    const totalSellPrice = totalPriceToSellItem(itemName, type, quantity)
    this._updatePrices()
    return totalSellPrice
  }

  totalPriceToBuyItem(itemName, type, quantity) {
    let totalPrice = 0
    let inventoryQuantity = this.itemData[itemName].types[typeName]
    for(let i = 0; i < quantity; i++) {
      const itemData = ITEMS[itemName].types[typeName]
      const quantity = inventoryQuantity
      const demand = this.itemData[itemName].demand
      const fractionOfDemand = quantity / demand
      const demandValue = 3 * Math.pow(0.5, fractionOfDemand)
      const naturalPrice = itemData.baseValue * demandValue
      const minimumPrice = itemData.baseValue * factorialize(itemData.rarity)
      totalPrice += Math.max(naturalPrice, minimumPrice) * this.sellPriceMultiplier / 100
      inventoryQuantity--
    }
    return totalPrice
  }

  totalPriceToSellItem(itemName, typeName, quantity) {
    let totalPrice = 0
    let inventoryQuantity = this.itemData[itemName].types[typeName]
    for(let i = 0; i < quantity; i++) {
      const itemData = ITEMS[itemName].types[typeName]
      const quantity = inventoryQuantity
      const demand = this.itemData[itemName].demand
      const fractionOfDemand = quantity / demand
      const demandValue = 3 * Math.pow(0.5, fractionOfDemand)
      const naturalPrice = itemData.baseValue * demandValue
      const minimumPrice = itemData.baseValue * factorialize(itemData.rarity)
      totalPrice += Math.max(naturalPrice, minimumPrice) * this.buyPriceMultiplier / 100
      inventoryQuantity++
    }
    return totalPrice
  }

  _updatePrices() {
    for (let itemName in this.itemData) {
      const item = this.itemData[itemName]
      for (let typeName in item.types) {
        const type = item.types[typeName]
        const itemData = ITEMS[itemName]
        const quantity = this.inventory.getItemWithType(itemName, typeName)
        const demand = item.demand
        const fractionOfDemand = quantity / demand
        const demandValue = 3 * Math.pow(0.5, fractionOfDemand)
        const naturalPrice = itemData.baseValue * demandValue
        const minimumPrice = itemData.baseValue * factorialize(type.rarity)
        type.buyPrice = Math.max(naturalPrice, minimumPrice) * this.buyPriceMultiplier / 100
        type.sellPrice = Math.max(naturalPrice, minimumPrice) * this.sellPriceMultiplier / 100
      }
    }
  }

  _updatePriceMultipliers() {
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

  _consumeItems() {
    for (let itemName in this.itemData) {
      const item = this.itemData[itemName]
      const baseDemand = item.demand
      const population = MARKETS[this.locationName].population
      const actualDemand = population * baseDemand / 365
      
      for (let typeName in item.types) {
        const type = item.types[typeName]
        const typeConsumption = actualDemand * (1 / Math.pow(1.1, type.rarity))
        console.log(`Consuming ${typeConsumption} of ${type.name} with rarity ${type.rarity} from ${this.locationName}`)
        this.inventory.removeItems(itemName, typeName, typeConsumption)
      }
    }
  }

  _produceItems() {
    // const roll = normalDistribution(1, 100, 1)
    // item.rarity = producer.skill * (roll/50)
    // item.rarity = Math.round(item.rarity)
    this.production.forEach(product => {
      for (let typeName in this.itemData[product.item].types) {
        const type = this.itemData[product.item].types[typeName]
        const roll = normalDistribution(1, 100, 1)
        const skillCoefficient = product.skill * roll / 50
        console.log(`Adding ${Math.round(skillCoefficient * product.quantity / type.rarity)} of ${type.name} with skill ${product.skill} in ${this.locationName}`)
        this.inventory.addItems(product.item, typeName, Math.round(skillCoefficient * product.quantity / type.rarity))
      }
    })
  }
}