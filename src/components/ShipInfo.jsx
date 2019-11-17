import React from 'react'

import Item from './Item.jsx'

class ShipInfo extends React.Component {
  constructor(props) {
    super(props)
    this.onSellItem = this.onSellItem.bind(this)
  }

  onSellItem(item) {
    if (this.props.onSellItem) {
      this.props.onSellItem(item)
    }
  }
  render() {
    const ship = this.props.ship
    return (
      <div className="ship-info">
        <h1>Inventory</h1>
        {ship.cargo.map(item => 
          <Item
          key={item.id}
          item={item}
          hasButton={true}
          buttonText='Sell'
          onButtonClick={() => this.onSellItem(item)}
        />
        )}
      </div>
    )
  }
}

export default ShipInfo