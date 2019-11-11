import Konva from 'konva'
import World from './world.js'
import { createRandomItem } from './ship.js'

document.addEventListener('DOMContentLoaded', () => {

    const world = new World()

    const stage = new Konva.Stage({
        container: 'container',
        width: 500,
        height: 500
    })

    const layer = new Konva.Layer()

    layer.add(world.getView())
    stage.add(layer)
    layer.draw()

    const konvaLoop = new Konva.Animation(frame => {
        const time = frame.time
        const timeDiff = frame.timeDiff
        const frameRate = frame.frameRate 
        world.update(timeDiff)
    }, layer)

    konvaLoop.start()

})