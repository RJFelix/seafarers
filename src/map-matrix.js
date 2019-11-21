import mapMatrix from '../assets/mapMatrix.txt'
var PF = require('pathfinding')

const width = 5 //3592
const height = 5 //2416

const outArray = []

for (let y = 0; y < height; y ++) {
    const currentRow = []
    for (let x = 0; x < width; x++) {
        currentRow[x] = mapMatrix[x + (y * width)]
    }
    outArray[y] = currentRow
}

export const makeAMap = () => {
    console.log(outArray)
}