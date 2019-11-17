import React from 'react'

import Item from './Item.jsx'

import '../styles/LocationInfo.css'

class LocationInfo extends React.Component {
  constructor(props) {
    super(props)
    this.onBuyItem = this.onBuyItem.bind(this)
  }

  onBuyItem(item) {
    this.props.onBuyItem(item)
  }

  render() {
    const location = this.props.location
    if (location) {
      return (
        <div className="location-info">
          <h1>{location.name}</h1>
          {location.market.map((item) => 
            <Item
              key={item.id}
              item={item}
              hasButton={true}
              buttonText='Buy'
              onButtonClick={() => this.onBuyItem(item)}
            />
          )
          }
        </div>
      )
    } else {
      return (
        <div className="location-info">
          <h1>At Sea</h1>
        </div>
      )
    }
    
  }
}

export default LocationInfo