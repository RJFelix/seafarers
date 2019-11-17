import React from 'react'
import { Rect } from 'react-konva'

import { radiansToDegrees } from '../utils.js'

export default function Ship(props) {
  return (
    <Rect
      x={props.ship.position.x}
      y={props.ship.position.y}
      rotation={radiansToDegrees(props.ship.angle || 0)}
      width={30}
      height={10}
      offsetX={15}
      offsetY={5}
      fill='red'
    />
  )
}