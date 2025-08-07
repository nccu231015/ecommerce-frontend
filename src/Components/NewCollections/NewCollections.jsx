import React from 'react'
import './NewCollections.css'
import { Item } from '../Item/Item'
import { useEffect, useState } from 'react'

export const NewCollections = () => {

  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/newcollection`)
      .then((response) => response.json())
      .then((data) => setNewCollection(data))
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
