import React from 'react'

import LocationInfo from './LocationInfo.jsx'
import WorldMap from './WorldMap.jsx'
import ShipInfo from './ShipInfo.jsx'

import World from '../world.js'

class Game extends React.Component {
  constructor(props) {
    super(props)
    // OLD CODE
    // initial setup of internal state etc.
    this.world = new World()

    // NEW CODE
    this.state = {
      lastTimestamp: 0,
      locationName: 'Some location',
      locationMarket: null,
      shipInventory: null
    }

    this.tick = this.tick.bind(this)

  }

  tick(timestamp) {
    // update the game
    const timeSinceLastUpdate = timestamp - this.state.lastTimestamp
    this.world.update(timeSinceLastUpdate)
    this.setState({
      lastTimestamp: timestamp
    })
    window.requestAnimationFrame((timestamp) => this.tick(timestamp))
  }

  componentDidMount() {
    window.requestAnimationFrame((timestamp) => {
      this.setState({
        lastTimestamp: timestamp
      })
      this.tick(timestamp)
    })
  }

  // These run in a loop
  render() {
    return (
      <div>
        <WorldMap
          world={this.world}
        />
        <LocationInfo
          locationName={this.state.locationName}
          locationMarket={this.state.locationMarket}
        />
        <ShipInfo
          shipInventory={this.state.shipInventory}
        />
      </div>
    )
  }
}

export default Game