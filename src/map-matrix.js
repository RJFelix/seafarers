import mapMatrix from '../assets/mapMatrix.txt'
import PF from 'pathfinding'
import EasyStar from 'easystarjs'

const easystar = new EasyStar.js()

const width = 3592
const height = 3592

const outArray = []

for (let y = 0; y < height; y ++) {
    const currentRow = []
    for (let x = 0; x < width; x++) {
        currentRow[x] = (mapMatrix[x + (y * width)] === "0" ? 0 : 1)
    }
    outArray[y] = currentRow
}

easystar.setGrid(outArray)
easystar.setAcceptableTiles([0])
// easystar.setIterationsPerCalculation(5000)
easystar.enableDiagonals()
easystar.enableSync()
export const findPathAsync = (origin, destination) => {
    return new Promise((resolve, reject) => {
        easystar.findPath(origin.x, origin.y, destination.x, destination.y, path => {
            if (path) {
                resolve(path)
            } else {
                reject('no path')
            }
        })
        easystar.calculate()
    })
}

setInterval(easystar.calculate, 100)

export const setGrid = array => {
    grid = new PF.Grid(array)
}

export const path = (origin, destination) => {
    const dirtyGrid = grid.clone()
    return finder.findPath(origin.x, origin.y, destination.x, destination.y, dirtyGrid)
}

export const pointAt = point => {
    return grid.getNodeAt(point.x, point.y)
}

export const pathArray = outArray