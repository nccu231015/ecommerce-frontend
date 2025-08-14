import React, { useState, useEffect } from 'react';
import './HoverRecommendation.css';
import { Link } from 'react-router-dom';

export const HoverRecommendation = ({ productId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isHovered && productId && recommendations.length === 0) {
      fetchRecommendations();
    }
  }, [isHovered, productId]);

  const fetchRecommendations = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/related-products/${productId}?limit=2`);
      
      if (!response.ok) {
        throw new Error('網絡響應不佳');
      }
      
      const data = await response.json();
      
      if (data.success && data.results) {
        setRecommendations(data.results);
      }
    } catch (err) {
      console.error('獲取推薦商品失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div 
      className="hover-recommendation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="recommendation-trigger">
        <span className="recommendation-text">猜你也喜歡</span>
        <span className="recommendation-icon">💡</span>
      </div>
      
      {isHovered && (
        <div className="recommendation-popup">
          <div className="popup-header">
            <span>AI 為您推薦</span>
          </div>
          <div className="popup-content">
            {loading ? (
              <div className="popup-loading">載入中...</div>
            ) : recommendations.length > 0 ? (
              recommendations.map((item) => (
                <Link 
                  key={item.id} 
                  to={`/product/${item.id}`} 
                  className="recommendation-item"
                  onClick={handleClick}
                >
                  <img src={item.image} alt={item.name} className="rec-image" />
                  <div className="rec-info">
                    <p className="rec-name">{item.name}</p>
                    <p className="rec-price">${item.new_price}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="popup-no-results">暫無推薦商品</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
