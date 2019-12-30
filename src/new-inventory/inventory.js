import ITEMS from '../data/items.js'

export default class Inventory {
  constructor() {
    // Map of itemId -> type -> quantity
    this.items = {}

    Object.keys(ITEMS).forEach(key => {
      this.items[key] = {}
      Object.keys(ITEMS[key].types).forEach(typeKey => {
        this.items[key][typeKey] = 0
      })
    })
  }

  addItems(name, type, quantity) {
    this.items[name][type] += quantity
  }

  removeItems(name, type, quantity) {
    const numberRemoved = Math.min(Math.ceil(quantity), this.items[name][type])
    this.items[name][type] -= numberRemoved
    return numberRemoved
  }

  getItemWithType(name, type) {
    return this.items[name][type]
  }

  getItemData() {
    const itemData = []
    for (const itemKey in this.items) {
      for (const typeKey in this.items[itemKey]) {
        if (this.items[itemKey][typeKey] > 0) {
          const thisItem = {
            itemKey,
            typeKey,
            name: ITEMS[itemKey].types[typeKey].name,
            quantity: this.items[itemKey][typeKey],
            rarity: ITEMS[itemKey].types[typeKey].rarity,
            weight: ITEMS[itemKey].weight,
            volume: ITEMS[itemKey].volume
          }
          itemData.push(thisItem)
        }
      }
    }

    return itemData
  }

  // Step over each item, receiving items in the format { name: String, quantity: Number }
  forEach(callback) {
    for (let itemKey in this.items) {
      const item = this.items[itemKey]
      for (let typeKey in item) {
        const type = item[typeKey]
        if (type > 0) {
          const entry = {
            name: itemKey,
            type: typeKey,
            quantity: type
          }
          callback(entry)
        }
      }
    }
  }
}