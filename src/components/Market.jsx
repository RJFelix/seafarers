import React from 'react'

import '../styles/Market.css'

class Market extends React.Component {

  render() {
    const items = this.props.items
    // items should look like:
    /*
    item {
      name: foo
      leftQuantity: 12
      rightQuantity: 17
      leftValue: 55
      rightValue: 81
    }
    */
    return (
      <div className='market-modal'>
        <div className='market-items'>
          {items.map(item => 
            <div className='market-item' key={item.key}>
              <p className='market-item-quantity'>{item.leftQuantity}</p>
              <div className={`market-item-button market-item-button-left${(item.leftValue > 0) ? ' market-item-button-active' : ' market-item-button-inactive'}`}
                onClick={() => this.props.onLeftClick(item)}
              ><span>{item.leftValue}</span></div>
              <p className='market-item-name'>{item.name}</p>
              <div className={`market-item-button market-item-button-right${(item.rightValue > 0) ? ' market-item-button-active' : ' market-item-button-inactive'}`}
                onClick={() => this.props.onRightClick(item)}
              ><span>{item.rightValue}</span></div>
              <p className='market-item-quantity'>{item.rightQuantity}</p>
            </div> 
          )}
        </div>
        <button
          onClick={this.props.onExit}
        >
          Exit
        </button>
      </div>
    )
  }
}

export default Market