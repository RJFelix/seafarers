export default [
    {
        name: 'Sloop',
        masts: 1,
        sailsRequired: 1,
        hullSize: 10,
        gunPorts: 2,
        speed: 1,
        unladenMass: 51000,
        inventories: {cargo: 268 /* 67 = 40' standard container */, cannonBalls: 40, larder: 2, berthing: 20}
    },
    {
        name: 'Brigantine',
        masts: 2,
        sailsRequired: 3,
        hullSize: 30,
        gunPorts: 4,
        speed: 1.1,
        unladenMass: 101000,
        inventories: {cargo: 536, cannonBalls: 80, larder: 5, berthing: 50}
    },
    {
        name: 'Carrack',
        masts: 3,
        sailsRequired: 7,
        hullSize: 90,
        gunPorts: 10,
        speed: 1.3,
        unladenMass: 301000,
        inventories: {cargo: 1608, cannonBalls: 200, larder: 20, berthing: 200}
    },
    {
        name: 'Galleon',
        masts: 4,
        sailsRequired: 10,
        hullSize: 120,
        gunPorts: 20,
        speed: 1.5,
        unladenMass: 401000,
        inventories: {cargo: 2144, cannonBalls: 400, larder: 30, berthing: 300}
    },
    {
        name: 'Frigate',
        masts: 5,
        sailsRequired: 14,
        hullSize: 200,
        gunPorts: 44,
        speed: 2,
        unladenMass: 701000,
        inventories: {cargo: 3752, cannonBalls: 880, larder: 50, berthing: 500}
    }
]