import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

export const Item = (props) => {
  // 處理點擊時滾動到頂部
  const handleClick = () => {
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="item">
        <Link to={`/product/${props.id}`} onClick={handleClick}>
          <img src={props.image} alt={props.name} />
        </Link>
        <p>{props.name}</p>
        <div className='item-prices'>
            <div className='item-price-new'>
                ${props.new_price}   
            </div>
            <div className='item-price-old'>
                ${props.old_price}
            </div>            
        </div>
    </div>
  )
}
