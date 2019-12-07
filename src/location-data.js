import producers from './producer-templates.js'
import Location from './location.js'

export default [
    new Location({
        name: 'Naples',
        x: 403,
        y: 119,
        producer: [producers[3], producers[4]],
        population: 23000
    }),
    new Location({
        name: 'Havana',
        x: 200,
        y: 176,
        producer: [producers[2], producers[3]],
        population: 1200
    }),
    new Location({
        name: 'Alexandria',
        x: 435,
        y: 150,
        producer: [producers[1], producers[2]],
        population: 400000
    }),
    new Location({
        name: 'Shanghai',
        x: 630,
        y: 150,
        producer: [producers[4], producers[1]],
        population: 1678999
    })
]