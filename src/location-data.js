import producers from './producer-templates.js'
import Location from './location.js'

export default [
    new Location({
        name: 'Naples',
        x: 75,
        y: 51,
        producer: producers[1]
    }),
    new Location({
        name: 'Venice',
        x: 94,
        y: 200,
        producer: producers[2]
    }),
    new Location({
        name: 'Alexandria',
        x: 241,
        y: 197
    }),
    new Location({
        name: 'Shanghai',
        x: 400,
        y: 400,
        producer: producers[0]
    })
]