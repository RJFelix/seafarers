import React from 'react'

import WorldMap from './WorldMap.jsx'
import NewMarket from './NewMarket.jsx'
import ShipTable from './ShipTable.jsx'
import SidePanel from './SidePanel.jsx'
import World from '../world.js'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

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
    this.onSellItems = this.onSellItems.bind(this)
    this.onShipReachedDestination = this.onShipReachedDestination.bind(this)
    this.getItemsForMarket = this.getItemsForMarket.bind(this)
    this.onMarketExit = this.onMarketExit.bind(this)
    this.onNewPath = this.onNewPath.bind(this)

    this.onBuyItem_new = this.onBuyItem_new.bind(this)
    this.onBuyQuantityChanged_new = this.onBuyQuantityChanged_new.bind(this)

    this.world.ship.onReachedDestination(this.onShipReachedDestination)
  }

  tick(timestamp) {
    // update the game
    // const timeSinceLastUpdate = timestamp - this.state.lastTimestamp
    // // update if some time has passed 
    // if (timeSinceLastUpdate > 16) {
    //   // update the game clock if enough time has passed
    //   if (timestamp > this.state.gameTimeLastUpdatedTimestamp + ((1 / this.state.gameSpeed) * 1000)) {
    //     const newGameTime = this.state.gameTime + 1
    //     this.world.updateGame(newGameTime)
    //     // this.setState({
    //     //   gameTime: newGameTime,
    //     //   gameTimeLastUpdatedTimestamp: timestamp
    //     // })
    //   }
    //   this.world.update(timeSinceLastUpdate)
    //   // this.setState({
    //   //   lastTimestamp: timestamp
    //   // })
    // }
    // window.requestAnimationFrame((timestamp) => this.tick(timestamp))
  }

  onBuyItem(item) {
    console.log('buying an item:')
    console.log(item)
    const coverChargeObject = this.world.ship.cargo.find(element => element.name == "Doubloon")
    if (item && coverChargeObject && (coverChargeObject.value >= item.sellPrice)) {
      if (this.world.ship.addCargo(item)) {
        this.world.ship.location.buyItem(item)
        // Add Payment to the Market
        this.world.ship.location.market.push(this.world.ship.getPaymentFromValue(item.sellPrice))
        this.world.ship.location.regroupItems()
        // Remove Payment from the Ship
        const doubloonIndex = this.world.ship.cargo.findIndex(element => element.name == "Doubloon")
        const newBalance = this.world.ship.cargo[doubloonIndex].value - item.sellPrice
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
    this.forceUpdate()
  }

  onBuyItem_new({ itemId }) {

  }

  onBuyQuantityChanged_new({ itemId, quantity }) {
    // remove <quantity> items from market and update value
    // make sure to keep track of <quantity> so we can re-add them when we leave
    // or commit when we buy the items
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
      if(coverChargeObject && coverChargeObject.value >= item.buyPrice) {
        this.world.ship.sellCargo(item)
        // Put the sold item into the market inventory.
        this.world.ship.location.market.push(item)
        // Remove Payment from the Market
        const doubloonIndex = this.world.ship.location.market.findIndex(element => element.name == "Doubloon")
        const newBalance = this.world.ship.location.market[doubloonIndex].value - item.buyPrice
        this.world.ship.location.market.splice(doubloonIndex, 1)
        this.world.ship.location.market.push(this.world.ship.getPaymentFromValue(newBalance))
        this.world.ship.location.regroupItems()
      } else {
        console.log("Market can't afford that item!")
      }
    }
    this.forceUpdate()
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
    this.world.onNewTime(({time, speed}) => {
      this.setState({
        gameTime: time,
        gameSpeed: speed
      })
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
      if (this.world.ship.location) {
        const shipCargo = this.world.ship.cargo
        const shipCargoWithPrices = shipCargo.map(item => {
          const marketItem = this.world.ship.location.market.find(it => it.name === item.name && it.rarity === item.rarity)
          if (marketItem) {
            return {
              ...item,
              buyPrice: marketItem.buyPrice
            }
          } else {
            return {
              ...item,
              buyPrice: item.value * 3
            }
          }
        })
        return shipCargoWithPrices
      }
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

  onNewPath(path) {
    this.world.ship.setPath(path)
  }

  // These run in a loop
  render() {
    const compartments = {
      info: [this.world.ship.type],
      cargo: this.getShipInventory()
    }
    return (
      <div className='game'>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          <Grid item xs={6}>
            <WorldMap
              world={this.world}
              newPath={this.onNewPath}
            />
          </Grid>
          {/* <ShipInfo
            ship={this.world.ship}
            onSellItem={this.onSellItem}
          /> */}
          <Grid item xs={6}>
            <SidePanel>
              <Paper className='game-details' key='game-details'>
                <h3>Time: {this.state.gameTime} days; Speed: {this.state.gameSpeed} days/sec</h3>
              </Paper>
              <ShipTable
                compartments={compartments}
                onBuyItems={this.onSellItems}
                type={this.world.ship.type}
                key='ship-table'
              />
                
              {this.state.marketOpen &&
                <NewMarket
                  rows={this.world.ship.location ? this.world.getMarketForLocation(this.world.ship.location).getItems() /* ship.location.market.filter(item => item.quantity > 0) */ : []}
                  location={this.world.ship.location}
                  market={this.world.ship.location && this.world.getMarketForLocation(this.world.ship.location)}
                  onExit={this.onMarketExit}
                  onBuyItems={this.onBuyItems}
                  onBuyItem_new={this.onBuyItem_new}
                  onBuyQuantityChanged_new={this.onBuyQuantityChanged_new}
                  key='market-table'
                />
              }
            </SidePanel>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default Game