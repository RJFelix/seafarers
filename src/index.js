import Konva from 'konva'
import World from './world.js'

document.addEventListener('DOMContentLoaded', () => {

    const world = new World()

    const stage = new Konva.Stage({
        container: 'container',
        width: 1000,
        height: 1000
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