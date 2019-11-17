import React from 'react'
import Konva from 'konva'

import { Stage, Layer, Image as KonvaImage } from 'react-konva'

import Location from './Location.jsx'
import Ship from './Ship.jsx'

import worldMapSvg from '../../assets/WorldMap.svg'

import '../styles/WorldMap.css'

class WorldMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      backgroundImage: null
    }
  }

  componentDidMount() {
    const worldMapImage = new Image()
    worldMapImage.src = worldMapSvg
    worldMapImage.onload = () => {
      this.setState({
        backgroundImage: worldMapImage
      })
    }
  }
  render() {
    const world = this.props.world
    return (
      <Stage 
        width={800}
        height={600}
        className='world-map'>
        <Layer>
          {this.state.backgroundImage &&
          <KonvaImage
            x={0}
            y={0}
            width={800}
            height={600}
            image={this.state.backgroundImage}
          />
          }
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