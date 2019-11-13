import { randomInt, normalDistribution } from './utils.js'
import itemTemplates from './item-templates.js'
import producerTemplates from './producer-templates.js'

// export default class Item {
//   constructor( { name, weight, volume, value, rarity, madeBy } ) {
//       this.name = name
//       this.weight = weight
//       this.volume = volume
//       this.value = value
//       this.rarity = rarity
//       this.madeBy = madeBy
//   }
// }

export const createItemFromProducer = (producer) => {
  const itemTemplate = itemTemplates[producer.itemId]
  const item = createItemFromTemplate(itemTemplate, producer)

  if (itemTemplate.hasRarity) {
    const roll = normalDistribution(1, 100, 1)
    item.rarity = producer.skill * (roll/50)
    item.rarity = Math.round(item.rarity)
  }

  return item
}

const createProducerFromTemplate = (producerTemplate) => {
  const randomProducer = createRandomProducerValues(producerTemplate.name, producerTemplate.produce)
  const producer = { ...randomProducer, ...producerTemplate }
  return producer
}

const createRandomProducerValues = (name, produce) => {
  const quantity = randomInt(1, 10)
  const skill = randomInt(1, 10)
  const producer = {
      quantity,
      skill,
      produce: produce || 'Generic Item',
      name: name || 'Generic Supplier'
  }
}

const createRandomItemValues = (itemName, producerName) => {
  const weight = randomInt(1, 100)
  const volume = randomInt(1, 1000)
  const value = randomInt(1, 1000)
  const rarity = randomInt(0, 2)
  const item = {
      weight,
      volume,
      value,
      rarity,
      name: itemName || 'Generic Item',
      madeBy: producerName || 'Generic Supplier'
  }
  return item
}

export const createItemFromTemplate = (itemTemplate, producerTemplate) => {
  const randomItem = createRandomItemValues(itemTemplate.name, producerTemplate.name)
  //const randomProducer = createRandomProducerValues(producerTemplate.name, ProducerTemplate.produce)
  
  // ...object "spreads" an object's entries (key-value pairs)
  // newObject = { ...oldObject } therefore takes all of the entries in oldObject and duplicates them in newObject,
  //   i.e. creates a clone of oldObject
  // newObject = { ...oldObject, ...anotherObject } - "spreads" from left to right, so first duplicate all the entries in oldObject
  //   into newObject, then duplicate all the entries in anotherObject into newObject, replacing any existing entries (from oldObject)
  //   that share the same key.
  const item = { ...randomItem, ...itemTemplate.template }
  if (!itemTemplate.hasRarity) {
    item.rarity = 1
  }
  return item
}

export const createRandomItem = () => {
  const itemTemplateIndex = randomInt(0, itemTemplates.length)
  const producerTemplateIndex = randomInt(0, producerTemplates.length)
  const itemTemplate = itemTemplates[itemTemplateIndex]
  const producerTemplate = producerTemplates[producerTemplateIndex]
  const randomProducer = createProducerFromTemplate(producerTemplate)
  const randomItem = createItemFromTemplate(itemTemplate, randomProducer)
  return randomItem
}