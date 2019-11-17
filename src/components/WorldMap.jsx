import React from 'react'

import { Stage, Layer } from 'react-konva'

class WorldMap extends React.Component {
  render() {
    return (
      <Stage width="800px" height="600px">
        <Layer>
          {this.props.view}
        </Layer>
      </Stage>
    )
  }
}

export default WorldMap