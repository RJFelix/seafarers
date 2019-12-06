import React from 'react'

import LocationInfo from './LocationInfo.jsx'
import WorldMap from './WorldMap.jsx'
import ShipInfo from './ShipInfo.jsx'
import Market from './Market.jsx'
import NewMarket from './NewMarket.jsx'
import ShipTable from './ShipTable.jsx'

import World from '../world.js'

import '../styles/Game.css'

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.world = new World()
    // NEW CODE
    this.state = {
      marketOpen: false,
      gameTime: 0,
      gameSpeed: 1, // per second?
      gameTimeLastUpdatedTimestamp: 0
    }

    this.tick = this.tick.bind(this)
    this.onBuyItem = this.onBuyItem.bind(this)
    this.onBuyItems = this.onBuyItems.bind(this)
    this.onSellItem = this.onSellItem.bind(this)
    this.onShipReachedDestination = this.onShipReachedDestination.bind(this)
    this.getItemsForMarket = this.getItemsForMarket.bind(this)
    this.onMarketExit = this.onMarketExit.bind(this)

    this.world.ship.onReachedDestination(this.onShipReachedDestination)

    window.addEventListener('keypress', evt => {
      if (evt.key === '+') {
        this.setState({
          gameSpeed: this.state.gameSpeed * 1.5
        })
      } else if (evt.key === '-') {
        this.setState({
          gameSpeed: this.state.gameSpeed * 0.5
        })
      }
    })
  }

  tick(timestamp) {
    // update the game
    const timeSinceLastUpdate = timestamp - this.state.lastTimestamp
    // update if some time has passed 
    if (timestamp > this.state.lastTimestamp + 50) {
      // update the game clock if enough time has passed
      if (timestamp > this.state.gameTimeLastUpdatedTimestamp + ((1 / this.state.gameSpeed) * 1000)) {
        const newGameTime = this.state.gameTime + 1
        this.world.updateGame(newGameTime)
        this.setState({
          gameTime: newGameTime,
          gameTimeLastUpdatedTimestamp: timestamp
        })
      }
      this.world.update(timeSinceLastUpdate)
      this.setState({
        lastTimestamp: timestamp
      })
    }
    window.requestAnimationFrame((timestamp) => this.tick(timestamp))
  }

  onBuyItem(item) {
    const coverChargeObject = this.world.ship.cargo.find(element => element.name == "Doubloon")
    if (item && coverChargeObject && (coverChargeObject.value >= item.value)) {
      if (this.world.ship.addCargo(item)) {
        this.world.ship.location.buyItem(item)
        // Add Payment to the Market
        this.world.ship.location.market.push(this.world.ship.getPaymentFromValue(item.value))
        this.world.ship.location.regroupItems()
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

  onBuyItems(items) {
    items.forEach(item => this.onBuyItem(item))
  }

  onSellItems(items) {
    items.forEach(item => this.onSellItem(item))
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
        this.world.ship.location.regroupItems()
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

  getShipInventory() {
    if (this.world.ship.cargo) {
      return this.world.ship.cargo
    }
    return []
  }

  itemsAtLocation() {
    if (this.world.ship.location) {
      return this.world.ship.location.market
    }
    return []
  }

  // These run in a loop
  render() {
    return (
      <div className='game'>
        <WorldMap
          world={this.world}
        />
        <ShipInfo
          ship={this.world.ship}
          onSellItem={this.onSellItem}
        />
        <h1>Time: {this.state.gameTime} days</h1>
        <h2>Speed: {this.state.gameSpeed} days/sec</h2>
        <h3>Timestamp: {this.state.timestamp}</h3>
        <ShipTable
          rows={this.getShipInventory()}
          onBuyItems={this.onSellItems}
          type={this.world.ship.type}
        />
          
        {this.state.marketOpen &&
          <NewMarket
            rows={this.itemsAtLocation()}
            location={this.world.ship.location}
            onExit={this.onMarketExit}
            onBuyItems={this.onBuyItems}
          />
        }
      </div>
    )
  }
}

export default Game