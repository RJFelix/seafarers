import React from 'react'
import Konva from 'konva'
import { flatten } from 'lodash'
import Paper from '@material-ui/core/Paper'

import { Stage, Layer, Line, Image as KonvaImage } from 'react-konva'

import { path, pointAt, pathArray, setGrid, findPathAsync } from '../map-matrix'

import worldMapPng from '../../assets/WorldMap.png'
import sloopSvg from '../../assets/sloop.svg'

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

    this.canvasRef = React.createRef()
  }

  componentDidMount() {
    this.stage = new Konva.Stage({
      width,
      height,
      container: this.canvasRef.current
    })

    this.stage.on('click', this.onStageClick)

    this.layer = new Konva.Layer()

    const worldMapImage = new Image()
    worldMapImage.src = worldMapPng
    worldMapImage.onload = () => {
      const konvaImage = new Konva.Image({
        x: 0,
        y: 0,
        width,
        height,
        image: worldMapImage
      })
      this.layer.add(konvaImage)
      konvaImage.zIndex(0)
      this.layer.draw()
    }

    const shipImage = new Image()
    shipImage.src = sloopSvg
    shipImage.onload = () => {
      this.shipKonvaImage = new Konva.Image({
        x: this.props.world.ship.position.x,
        y: this.props.world.ship.position.y,
        width: 80,
        height: 40,
        offsetX: 40,
        offsetY: 20,
        image: shipImage
      })
      this.layer.add(this.shipKonvaImage)
      this.layer.draw()
      update()
    }

    this.props.world.locations.forEach(location => {
      const locationGroup = new Konva.Group({
        x: location.position.x,
        y: location.position.y
      })
      const locationRect = new Konva.Rect({
        x: 0,
        y: 0,
        width:10,
        height: 10,
        fill: 'green',
        stroke: 'black',
        // onMouseEnter: this.onMouseEnter,
        // onMouseLeave: this.onMouseLeave,
        // onClick: this.onClick,
      })
      const locationText = new Konva.Text({
        x: 15,
        y: 0,
        text: location.name
      })

      const select = () => locationRect.fill('yellow')
      const deselect = () => locationRect.fill('green')
      locationRect.on('mouseenter', select)
      locationRect.on('mouseleave', deselect)
      locationRect.on('click', location.onClick)

      locationGroup.add(locationRect)
      locationGroup.add(locationText)
      this.layer.add(locationGroup)
      this.layer.draw()
    })

    let lastTimestamp
    let test = 0
    const update = (timestamp) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp
      }
      const duration = timestamp - lastTimestamp
      this.props.world.update(duration)
      this.shipKonvaImage.position({
        x: this.props.world.ship.position.x,
        y: this.props.world.ship.position.y
      })

      this.layer.draw()

      lastTimestamp = timestamp
      window.requestAnimationFrame(update)
    }

    this.stage.add(this.layer)
  }

  onPathCoordinatesChanged() {
    if (this.pathCoordinates) {
      if (!this.pathLine) {
        this.pathLine = new Konva.Line({
          points: this.pathCoordinates,
          stroke: '#FF0000',
          strokeWidth: 3
        })
        this.layer.add(this.pathLine)
      } else {
        this.pathLine.points(this.pathCoordinates)
      }
      this.layer.draw()
    }
  }

  onCanvasClick(evt) {
    console.log(pathArray[evt.clientY][evt.clientX])
  }

  onStageClick(evt) {
    const x = evt.evt.offsetX
    const y = evt.evt.offsetY

    if (Object.keys(this.state.currentClick).length === 0) {
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
      findPathAsync(this.props.world.ship.position, this.state.currentClick)
        .then(coords => {
          this.pathCoordinates = []
          for (let i = 0; i < coords.length; i++) {
            this.pathCoordinates.push(coords[i].x)
            this.pathCoordinates.push(coords[i].y)
          }

          this.props.newPath(coords)
          this.onPathCoordinatesChanged()

          this.setState({
            pathSequence: this.state.pathSequence + 1
          })
        })
    })
  }

  render() {
    const world = this.props.world
    return (
      <div className='world-map-container'>
        <div ref={this.canvasRef} />
          {/* <Stage
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
          </Stage> */}
      </div>
    )
  }
}

export default WorldMap