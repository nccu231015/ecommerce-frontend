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
        {props.recommendation_type && (
          <div className="recommendation-badge">
            {props.recommendation_type === "vector_similarity" ? "AI 智能推薦" : 
             props.recommendation_type === "category_tag_match" ? "類別推薦" : 
             props.recommendation_type === "random" ? "為您精選" : "推薦商品"}
          </div>
        )}
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
