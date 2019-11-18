export default [
    {
        template: {
            name: 'Doubloon',
            weight: 0.006867, // 6.867g real weight of a doubloon.
            volume: 0.000001581, // 1581 mm3 real volume of a doubloon.
            baseValue: 1
        },
        hasRarity: false
    },
    {
        template: {
            name: 'Cannonball',
            weight: 5.4, // 12 lb ball
            volume: 0.000731, // 2.2 in radius
            baseValue: 3
        },
        hasRarity: false
    },
    {
        template: {
            name: 'Crate of 100 Linen Bolts',
            weight: 300, // bulk fabric weighs 150-900kg depending on fiber and storage method (baled, boxed, bolted,) per m3
            volume: 1,
            baseValue: 12
        },
        hasRarity: true
    },
    {
        template: {
            name: 'Crate of Tea',
            weight: 50,
            volume: 1,
            baseValue: 6
        },
        hasRarity: true
    },
    {
        template: {
            name: 'Bushel of Wheat',
            weight: 27.2155, // real weight
            volume: .036369, // real volume
            baseValue: 2
        }
    }
]