import React from 'react'
import { Image as KonvaImage } from 'react-konva'
import sloopSvg from '../../assets/sloop.svg'

import { radiansToDegrees } from '../utils.js'

export default class Ship extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shipImage: null
    }
  }

  componentDidMount() {
    const shipImage = new Image()
    shipImage.src = sloopSvg
    shipImage.onload = () => {
      this.setState({
        backgroundImage: shipImage
      })
    }
  }

  render() {
    return (
      <KonvaImage
        image={this.state.backgroundImage}
        x={this.props.ship.position.x}
        y={this.props.ship.position.y}
        width={80}
        height={50}
        offsetX={40}
        offsetY={25}
      />
      // <Rect
      //   x={props.ship.position.x}
      //   y={props.ship.position.y}
      //   rotation={radiansToDegrees(props.ship.angle || 0)}
      //   width={30}
      //   height={10}
      //   offsetX={15}
      //   offsetY={5}
      //   fill='red'
      // />
    )
  }
  
}