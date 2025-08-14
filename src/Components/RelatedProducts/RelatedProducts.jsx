import React, { useState, useEffect } from 'react'
import './RelatedProducts.css';
import { Item } from '../Item/Item';

export const RelatedProducts = ({ productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/related-products/${productId}`);
        
        if (!response.ok) {
          throw new Error('網絡響應不佳');
        }
        
        const data = await response.json();
        
        if (data.success && data.results) {
          setRelatedProducts(data.results);
        } else {
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error('獲取相關商品失敗:', err);
        setError('無法載入相關商品推薦');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatedProducts();
  }, [productId]);

  return (
    <div className='relatedproducts'>
      <h1>相關商品推薦</h1>
      <hr />
      <div className="relatedproducts-item">
        {loading ? (
          <div className="loading-indicator">載入中...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : relatedProducts.length > 0 ? (
          relatedProducts.map((item) => (
            <Item 
              key={item.id} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price}
              recommendation_type={item.recommendation_type}
            />
          ))
        ) : (
          <div className="no-results">沒有找到相關商品</div>
        )}
      </div>
    </div>
  )
}
