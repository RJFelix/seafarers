export const randomInt = (min, max) => min + Math.floor(Math.random() * max)
export const degreesToRadians = degrees => degrees * (Math.PI / 180)
export const radiansToDegrees = radians => radians * (180 / Math.PI)

export const normalDistribution = (min, max, skew) => {
    var u = 0, v = 0
    while(u === 0) u = Math.random()
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )

    num = num / 10.0 + 0.5
    if (num > 1 || num < 0) num = randn_bm(min, max, skew) // Throws away outliers 3.6+ stds (.02% chance to happen).
    num = Math.pow(num, skew)
    num *= max - min
    num += min
    return num
}

// export function groupBy(list, keyGetter) {
//     const map = new Map();
//     list.forEach((item) => {
//          const key = keyGetter(item);
//          const collection = map.get(key);
//          if (!collection) {
//              map.set(key, [item]);
//          } else {
//              collection.push(item);
//          }
//     });
//     return map;
// }

export const groupBy2 = (items, key) => items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }), 
    {},
  );

export const groupByAsArrays = (items, key) => {
  const result = {}
  for (const item of items) {
    const currentResultForThisKey = result[key]
    // i.e. if key === 'name'
    // then result[key] is equivalent to result.name
    if (!currentResultForThisKey) {
      // [ foo ] gives us an array with only foo in it
      result[key] = [ item ]
      // less idiomatic way of doing this would be
      // result[key] = new Array()
      // result[key].push(item)
    } else {
      result[key].push(item)
    }
  }
  return result
}

// items = [ { name: 'Apple', price: '1.99' }, { name: 'Banana', price: '0.99' }, {name: 'Apple', price: '1.49'}]
// groupBy(items, 'name'):
//  beginning of first iteration of loop
//  result = {} empty object
//  item = { name: 'Apple', price: '1.99' 0}
//  result[key] ~ result.name = undefined
//  currentResultForThisKey = undefined
//  so we take the "if"
//    set result[key] ~ result.name to the array [ { name: 'Apple', price: '1.99' } ]
//
//  beginning of second iteration
//  result = {
//    Apple: [ { name: 'Apple', price: '1.99' } ]
// }
//  
//  beginning of third iteration
//  result = {
//    Apple: [ { name: 'Apple', price: '1.99' } ]
//    Banana: [ { name: 'Banana', price: '0.99' } ]
//  }
// 
//   at the end the return value is
// result = {
//    Apple: [ { name: 'Apple', price: '1.99' }, { name: 'Apple', price: '1.49' } ]
//    Banana: [ { name: 'Banana', price: '0.99' } ]
//  }

/**
 * items: some array of objects
 * key: the key in those objects to group by
 * combine: a function that takes (item, item) -> item
 * 
 * returns an object whose keys are the values in the various items whose key is ${key}
 * and whose values are one combined item per key
 */
export const groupByAndCombine = (items, key, combine) => {
  // `this is called a string template and we can put values in it`
  console.log(`Grouping by ${key}.`)
  const result = {}
  for (const item of items) {
    const currentResultForThisKey = result[key]
    // i.e. if key === 'name'
    // then result[key] is equivalent to result.name
    if (!currentResultForThisKey) {
      // set result[key] to this item
      result[key] = item
    } else {
      result[key] = combine(result[key], item)
    }
  }
  return result
}
// combine({ name: 'Apple', price: '1.99', qualityPercent: 80, type: 'Gala' }, { name: 'Apple', price: '1.49', qualityPercent: 60, type: 'Fuji' })
//   -> { name: 'Apple', price: '3.48', qualityPercent: 70, type: ['Gala', 'Fuji'] }
//
// Assuming the function "combine" works like we expect it to,
//  result of groupByAndCombine will be:
//  {
//    Apple: { name: 'Apple', price: 3.48 },
//    Banana: { name: 'Banana', price: 0.99 }
//  }

/**
 * items: some array of objects
 * keys: array of keys in those objects to group by. for multiple keys group by unique combination of them
 * combine: a function that takes (item, item) -> item
 * 
 * returns an object whose keys are the values in the various items whose key is ${key}
 * and whose values are one combined item per key
 */
export const groupBy = (items, keys, combine) => {
  const combinedItems = {}
  for (const item of items) {
    // combine all of the values of the keys to group by into a single string
    let combinedKey = ''
    keys.forEach(key => {
      combinedKey = combinedKey + item[key]
    })
    const currentResultForThisKey = combinedItems[combinedKey]
    // i.e. if key === 'name'
    // then result[key] is equivalent to result.name
    if (!currentResultForThisKey) {
      // call combine with an empty/null "previously combined item"
      combinedItems[combinedKey] = combine(null, item)
    } else {
      combinedItems[combinedKey] = combine(combinedItems[combinedKey], item)
    }
  }
  const result = []
  for (const combinedItem of Object.values(combinedItems)) {
    result.push(combinedItem)
  }
  return result
}

// Assuming the function "combine" works like we expect it to,
// result of groupBy will be:
// [
//   { name: 'Apple', price: 3.48 },
//   { name: 'Banana', price: 0.99 } 
// ]

export function factorialize(num) {
  if (num < 0) 
        return -1;
  else if (num == 0) 
      return 1;
  else {
      return (num * factorialize(num - 1));
  }
}