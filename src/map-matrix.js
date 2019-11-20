import mapMatrix from '../../assets/mapMatrix.txt'
var PF = require('pathfinding')
const fs = require('fs')

export const makeAMap = () => fs.readFile(mapMatrix, (err, data) => {
    if (err) throw err;

    console.log(data.toString());
})