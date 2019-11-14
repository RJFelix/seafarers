export const randomInt = (min, max) => min + Math.floor(Math.random() * max)

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

export const groupBy = (items, key) => items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }), 
    {},
  );