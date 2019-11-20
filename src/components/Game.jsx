import React from 'react'

import LocationInfo from './LocationInfo.jsx'
import WorldMap from './WorldMap.jsx'
import ShipInfo from './ShipInfo.jsx'
import Market from './Market.jsx'

import World from '../world.js'

import '../styles/Game.css'

class Game extends React.Component {
  constructor(props) {
    super(props)
    // OLD CODE
    // initial setup of internal state etc.
    this.world = new World()

    // NEW CODE
    this.state = {
      marketOpen: false
    }

    this.tick = this.tick.bind(this)
    this.onBuyItem = this.onBuyItem.bind(this)
    this.onSellItem = this.onSellItem.bind(this)
    this.onShipReachedDestination = this.onShipReachedDestination.bind(this)
    this.getItemsForMarket = this.getItemsForMarket.bind(this)
    this.onMarketExit = this.onMarketExit.bind(this)

    this.world.ship.onReachedDestination(this.onShipReachedDestination)
  }

  tick(timestamp) {
    // update the game
    const timeSinceLastUpdate = timestamp - this.state.lastTimestamp
    this.world.update(timeSinceLastUpdate)
    this.setState({
      lastTimestamp: timestamp
    })
    window.requestAnimationFrame((timestamp) => this.tick(timestamp))
  }

  onBuyItem(item) {
    const coverChargeObject = this.world.ship.cargo.find(element => element.name == "Doubloon")
    if (item && coverChargeObject && (coverChargeObject.value >= item.value)) {
      if (this.world.ship.addCargo(item)) {
        this.world.ship.location.buyItem(item)
        // Add Payment to the Market
        this.world.ship.location.market.push(this.world.ship.getPaymentFromValue(item.value))
        // Remove Payment from the Ship
        const doubloonIndex = this.world.ship.cargo.findIndex(element => element.name == "Doubloon")
        const newBalance = this.world.ship.cargo[doubloonIndex].value - item.value
        this.world.ship.cargo.splice(doubloonIndex, 1)
        this.world.ship.cargo.push(this.world.ship.getPaymentFromValue(newBalance))
      } else {
        console.log("Can't add cargo. Max Capacity?")
      }
    } else {
      if (!item) {
        console.log("Not Item")
      }
      if (!coverChargeObject) {
        console.log("No Doubloons")
      }
      if (!(coverChargeObject.value >= item.value)) {
        console.log("Not Enough Doubloons")
      }
    }
  }

  onSellItem(item) {
    if (item) {
      const coverChargeObject = this.world.ship.location.market.find(element => element.name == "Doubloon")
      if(coverChargeObject && coverChargeObject.value >= item.value) {
        this.world.ship.sellCargo(item)
        // Put the sold item into the market inventory.
        this.world.ship.location.market.push(item)
        // Remove Payment from the Market
        const doubloonIndex = this.world.ship.location.market.findIndex(element => element.name == "Doubloon")
        const newBalance = this.world.ship.location.market[doubloonIndex].value - item.value
        this.world.ship.location.market.splice(doubloonIndex, 1)
        this.world.ship.location.market.push(this.world.ship.getPaymentFromValue(newBalance))
      } else {
        console.log("Market can't afford that item!")
      }
    }
  }

  onShipReachedDestination(location) {
    this.setState({
      marketOpen: true
    })
  }

  onMarketExit() {
    this.setState({
      marketOpen: false
    })
  }

  componentDidMount() {
    window.requestAnimationFrame((timestamp) => {
      this.setState({
        lastTimestamp: timestamp
      })
      this.tick(timestamp)
    })
  }
  
  getItemsForMarket() {
    // Should return an array of objects that fit what the market expects
    /*
    item {
      name: foo
      leftQuantity: 12
      rightQuantity: 17
      leftValue: 55
      rightValue: 81
    }
    */
   // Should have all item types that are in inventory and/or market
   const itemsForMarket = []
   const seenItems = new Set()
   this.world.ship.cargo.forEach(item => {
     const itemForMarket = {
       key: `${item.name}${item.rarity}`,
       name: item.name,
       rightQuantity: item.quantity,
       leftValue: item.value * 0.9,
       rightItem: item
     }
     const itemAtLocation = this.world.ship.location.market.find(it => it.name === item.name && it.rarity === item.rarity)
     if (itemAtLocation) {
       itemForMarket.leftQuantity = itemAtLocation.quantity
       itemForMarket.rightValue = item.value * 1.1
       itemForMarket.leftItem = itemAtLocation
     } else {
       itemForMarket.leftQuantity = 0
       itemForMarket.rightValue = 0
       itemForMarket.leftItem = null
     }
     seenItems.add(`${item.name}${item.rarity}`)
     itemsForMarket.push(itemForMarket)
   })
   this.world.ship.location.market.forEach(item => {
     if(!seenItems.has(`${item.name}${item.rarity}`)) {
       const itemForMarket = {
        key: `${item.name}${item.rarity}`,
         name: item.name,
         leftQuantity: item.quantity,
         rightQuantity: 0,
         rightValue: item.value * 1.1,
         leftValue: 0,
         leftItem: item,
         rightItem: null
       }
       itemsForMarket.push(itemForMarket)
     }
   })

   return itemsForMarket.filter(item => item.name !== 'Doubloon').sort((a, b) => {
     if (a.name < b.name) {
       return -1
     }
     if (a.name > b.name) {
       return 1
     }
     if (a.name === b.name) {
       return a.rarity - b.rarity
     }
   })
  }

  // These run in a loop
  render() {
    return (
      <div className='game'>
        <WorldMap
          world={this.world}
        />
        <LocationInfo
          location={this.world.ship.location}
          onBuyItem={this.onBuyItem}
        />
        <ShipInfo
          ship={this.world.ship}
          onSellItem={this.onSellItem}
        />
        {this.state.marketOpen &&
          <Market
            items={this.getItemsForMarket()}
            onExit={this.onMarketExit}
            onLeftClick={(item) => this.onSellItem(item.rightItem)}
            onRightClick={(item) => this.onBuyItem(item.leftItem)}
          />
        }
      </div>
    )
  }
}

export default Game