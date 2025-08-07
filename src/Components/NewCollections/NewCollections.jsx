import React from 'react'
import './NewCollections.css'
import { Item } from '../Item/Item'
import { useEffect, useState } from 'react'
import all_product from '../Assets/all_product'

export const NewCollections = () => {

  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/newcollection`)
      .then((response) => response.json())
      .then((data) => {
        // 合併後端數據和本地圖片
        const mergedData = data.map(apiProduct => {
          const localProduct = all_product.find(local => local.id === apiProduct.id);
          return {
            ...apiProduct,
            image: localProduct ? localProduct.image : apiProduct.image
          };
        });
        setNewCollection(mergedData);
      })
      .catch((error) => {
        console.error("API 獲取失敗，使用本地數據:", error);
        setNewCollection(all_product.slice(1).slice(-8));
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
