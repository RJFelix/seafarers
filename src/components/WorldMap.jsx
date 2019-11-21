import React from 'react'
import Konva from 'konva'
import { flatten } from 'lodash'

import { Stage, Layer, Line, Image as KonvaImage } from 'react-konva'

import Location from './Location.jsx'
import Ship from './Ship.jsx'
import { path, pointAt, pathArray, setGrid, findPathAsync } from '../map-matrix'

import worldMapPng from '../../assets/WorldMap.png'

import '../styles/WorldMap.css'

const width = 3592
const height = 2416

class WorldMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      backgroundImage: null,
      previousClick: {},
      currentClick: {},
      pathSequence: 0
    }
    this.onStageClick = this.onStageClick.bind(this)
    this.onCanvasClick = this.onCanvasClick.bind(this)
  }

  componentDidMount() {
    const worldMapImage = new Image()
    worldMapImage.src = worldMapPng
    worldMapImage.onload = () => {
      this.setState({
        backgroundImage: worldMapImage
      })
    }
  }

  onCanvasClick(evt) {
    console.log(pathArray[evt.clientY][evt.clientX])
  }

  onStageClick(evt) {
    const x = evt.evt.x
    const y = evt.evt.y

    if(Object.keys(this.state.currentClick).length === 0) {
      this.setState({
        currentClick: {
          x, y
        }
      })
      return
    }
    const currentClick = { ...this.state.currentClick }
    this.setState({
      previousClick: currentClick,
      currentClick: { x, y }
    }, () => {
      findPathAsync(this.state.previousClick, this.state.currentClick)
        .then(coords => {
          this.pathCoordinates = []
          for (let i = 0; i < coords.length; i++) {
            this.pathCoordinates.push(coords[i].x)
            this.pathCoordinates.push(coords[i].y)
          }

          this.setState({
            pathSequence: this.state.pathSequence + 1
          })
        })
    })
  }

  render() {
    const world = this.props.world
    return (
      <Stage 
        width={width}
        height={height}
        onclick={this.onStageClick}
        className='world-map'>
        <Layer>
          {this.state.backgroundImage &&
          <KonvaImage
            x={0}
            y={0}
            width={width}
            height={height}
            image={this.state.backgroundImage}
          />
          }
          {this.pathCoordinates && 
          <Line
            points={this.pathCoordinates}
            stroke={'#FF0000'}
            strokeWidth={3}
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