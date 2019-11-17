import React from 'react'

import { Group, Rect, Text } from 'react-konva'

class Location extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fill: 'green'
    }

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onMouseEnter() {
    this.setState({
      fill: 'yellow'
    })
  }

  onMouseLeave() {
    this.setState({
      fill: 'green'
    })
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render() {
    return (
      <Group
        x={this.props.location.position.x}
        y={this.props.location.position.y}
      >
        <Rect
          x={0}
          y={0}
          width={10}
          height={10}
          fill={this.state.fill}
          stroke='black'
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}
        />
        <Text
          x={15}
          y={0}
          text={this.props.location.name}
        />
      </Group>
    )
  }
}

export default Location