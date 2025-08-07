import React, { useEffect } from 'react'
import './Popular.css'
import { Item } from '../Item/Item'
import { useState } from 'react'
import all_product from '../Assets/all_product'


export const Popular = () => {

  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/popularinwomen`)
      .then((response) => response.json())
      .then((data) => {
        // 合併後端數據和外部圖片
        const mergedData = data.map(apiProduct => {
          // 檢查後端圖片 URL 是否有效
          const isValidImageUrl = apiProduct.image && 
                                !apiProduct.image.includes('localhost') && 
                                !apiProduct.image.includes('placeholder');
          
          return {
            ...apiProduct,
            image: apiProduct.image
          };
        });
        setPopularProducts(mergedData);
      })
      .catch((error) => {
        console.error("API 獲取失敗，使用本地數據:", error);
        // 如果 API 失敗，使用本地數據作為備用
        setPopularProducts(all_product.filter(item => item.category === "women").slice(0, 4));
      })
  }, []);

  return (
    <div className="popular">
        <h1>POPULAR IN WOMEN</h1>
        <hr />
        <div className='popular-item'>
            {popularProducts.map((item, i) => {
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}
