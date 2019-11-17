import React from 'react'
import Konva from 'konva'

import { Stage, Layer } from 'react-konva'

import Location from './Location.jsx'
import Ship from './Ship.jsx'

class WorldMap extends React.Component {
  render() {
    const world = this.props.world
    return (
      <Stage width={800} height={600}>
        <Layer>
          {world.locations.map(location => 
          <Location 
            key={location.id}
            location={location} 
            onClick={location.onClick}
          />
          )}
          <Ship
            ship={world.ship}
          />
        </Layer>
      </Stage>
    )
  }
}

export default WorldMap