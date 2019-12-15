import items from '../data/items.js'

export default class Inventory {
  constructor() {
    // Map of itemId -> type -> quantity
    this.items = {}

    Object.keys(items).forEach(key => {
      this.items[key] = {}
      Object.keys(items[key].types).forEach(typeKey => {
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