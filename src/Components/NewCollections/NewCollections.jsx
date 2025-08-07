import React from 'react'
import './NewCollections.css'
import { Item } from '../Item/Item'
import { useEffect, useState } from 'react'
import all_product from '../Assets/all_product'
import { getProductImage } from '../../utils/imageMap'

export const NewCollections = () => {

  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/newcollection`)
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
            image: isValidImageUrl ? apiProduct.image : getProductImage(apiProduct.id)
          };
        });
        setNewCollection(mergedData);
      })
      .catch((error) => {
        console.error("API 獲取失敗，使用本地數據:", error);
        const localWithImages = all_product.slice(1).slice(-8).map(product => ({
          ...product,
          image: getProductImage(product.id)
        }));
        setNewCollection(localWithImages);
      })
  }, []);
  return (
    <div className='new-collections' id='new-collections'>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className="collections">
            {newCollection.map((item, i) => {
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}
