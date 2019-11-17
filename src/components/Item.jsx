import React from 'react'

export default function Item(props) {
  const item = props.item
  return (
    <div>
      <p>{`${item.quantity}x ${item.name} made by ${item.madeBy} - $${item.value} - rarity ${item.rarity} - ${(Math.round(item.weight*100))/100} kg - ${(Math.round(item.volume*100))/100} m3`}</p>
      {props.hasButton &&
      <button
        onClick={props.onButtonClick}
      >{props.buttonText}</button>
      }
    </div>
  )
}