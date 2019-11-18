import producers from './producer-templates.js'
import Location from './location.js'

export default [
    new Location({
        name: 'Naples',
        x: 403,
        y: 143,
        producer: [producers[3], producers[4]]
    }),
    new Location({
        name: 'Havana',
        x: 200,
        y: 212,
        producer: [producers[2], producers[3]]
    }),
    new Location({
        name: 'Alexandria',
        x: 435,
        y: 180,
        producer: [producers[1], producers[2]]
    }),
    new Location({
        name: 'Shanghai',
        x: 630,
        y: 180,
        producer: [producers[4], producers[1]]
    })
]