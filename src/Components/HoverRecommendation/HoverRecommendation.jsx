import React, { useState, useEffect, useContext } from 'react';
import './HoverRecommendation.css';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

export const HoverRecommendation = ({ productId }) => {
  const { addToCart } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [materialComparison, setMaterialComparison] = useState(null);
  const [loadingMaterialComparison, setLoadingMaterialComparison] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (isHovered && productId && recommendations.length === 0) {
      fetchRecommendations();
    }
  }, [isHovered, productId]);

  // 當 productId 改變時，清空舊的推薦數據
  useEffect(() => {
    setRecommendations([]);
    setLoading(false);
    setSelectedForComparison(null);
    setShowComparisonModal(false);
  }, [productId]);

  // 獲取原始商品數據和材質比較
  useEffect(() => {
    if (selectedForComparison) {
      fetchOriginalProduct();
      fetchMaterialComparison();
    }
  }, [selectedForComparison]);

  const fetchOriginalProduct = async () => {
    if (!productId) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/product/${productId}`);
      if (!response.ok) {
        throw new Error('無法獲取原始商品數據');
      }
      const data = await response.json();
      if (data.success && data.product) {
        setOriginalProduct(data.product);
      }
    } catch (err) {
      console.error('獲取原始商品失敗:', err);
    }
  };

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

  const handleAddBothToCart = async () => {
    if (!originalProduct || !selectedForComparison || !addToCart) {
      console.error('無法添加商品到購物車：缺少必要數據');
      return;
    }

    try {
      setAddingToCart(true);
      
      // 添加原商品到購物車
      addToCart(originalProduct.id);
      // 添加推薦商品到購物車  
      addToCart(selectedForComparison.id);
      
      // 短暫延遲以顯示載入狀態
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 關閉比較模態視窗
      closeComparisonModal();
      
      // 可以添加成功提示的 toast 或其他 UI 反饋
      console.log('成功添加兩件商品到購物車');
      
    } catch (error) {
      console.error('添加商品到購物車失敗:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCompareClick = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedForComparison(item);
    setShowComparisonModal(true);
  };

  const fetchMaterialComparison = async () => {
    if (!productId || !selectedForComparison) return;
    
    try {
      setLoadingMaterialComparison(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/compare-materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalProductId: productId,
          recommendedProductId: selectedForComparison.id
        })
      });
      
      if (!response.ok) {
        throw new Error('材質比較請求失敗');
      }
      
      const data = await response.json();
      if (data.success && data.materialComparison) {
        setMaterialComparison(data.materialComparison);
      }
    } catch (err) {
      console.error('獲取材質比較失敗:', err);
      setMaterialComparison({
        comparison: '材質比較暫時不可用',
        confidence: '低'
      });
    } finally {
      setLoadingMaterialComparison(false);
    }
  };

  const closeComparisonModal = () => {
    setShowComparisonModal(false);
    setSelectedForComparison(null);
    setMaterialComparison(null);
    setLoadingMaterialComparison(false);
    setAddingToCart(false);
  };

  // 計算比較指標
  const calculateMetrics = () => {
    if (!originalProduct || !selectedForComparison) return null;

    const priceDiff = selectedForComparison.new_price - originalProduct.new_price;
    const priceDiffPercent = Math.round((priceDiff / originalProduct.new_price) * 100);
    
    return {
      price: {
        diff: priceDiff,
        percent: priceDiffPercent,
        better: priceDiff < 0 ? 'recommended' : priceDiff > 0 ? 'original' : 'equal'
      },
      category: {
        original: originalProduct.category,
        recommended: selectedForComparison.category,
        same: originalProduct.category === selectedForComparison.category
      },
      // 其他指標可以在這裡添加
    };
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
                <div key={item.id} className="recommendation-item-container">
                  <Link 
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
                  <button 
                    className="compare-button"
                    onClick={(e) => handleCompareClick(item, e)}
                  >
                    比較
                  </button>
                </div>
              ))
            ) : (
              <div className="popup-no-results">暫無推薦商品</div>
            )}
          </div>
        </div>
      )}

      {showComparisonModal && selectedForComparison && (
        <div className="comparison-modal-overlay" onClick={closeComparisonModal}>
          <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
            <div className="comparison-modal-header">
              <h3>商品比較 | 找出最適合您的選擇</h3>
              <button className="close-button" onClick={closeComparisonModal}>✕</button>
            </div>
            
            <div className="comparison-products">
              <div className="comparison-product original">
                <img src={originalProduct?.image} alt={originalProduct?.name} />
                <h4>{originalProduct?.name}</h4>
                <p className="price">${originalProduct?.new_price}</p>
                <div className="rating">
                  {/* 評分星星可以根據實際數據動態生成 */}
                  <span>★★★★☆</span>
                  <span className="rating-count">(122)</span>
                </div>
              </div>
              
              <div className="comparison-vs">
                <div className="vs-circle">VS</div>
                {calculateMetrics() && (
                  <div className="quick-metrics">
                    <div className={`metric price-diff ${calculateMetrics().price.better}`}>
                      {calculateMetrics().price.diff < 0 ? (
                        <span>便宜 {Math.abs(calculateMetrics().price.percent)}%</span>
                      ) : calculateMetrics().price.diff > 0 ? (
                        <span>貴 {calculateMetrics().price.percent}%</span>
                      ) : (
                        <span>價格相同</span>
                      )}
                    </div>
                    <div className={`metric category-diff ${calculateMetrics().category.same ? 'same' : 'different'}`}>
                      <span>{calculateMetrics().category.same ? '相同類別' : '不同類別'}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="comparison-product recommended">
                <img src={selectedForComparison.image} alt={selectedForComparison.name} />
                <h4>{selectedForComparison.name}</h4>
                <p className="price">${selectedForComparison.new_price}</p>
                <div className="rating">
                  {/* 評分星星可以根據實際數據動態生成 */}
                  <span>★★★★★</span>
                  <span className="rating-count">(87)</span>
                </div>
              </div>
            </div>
            
            <div className="comparison-details">
              <div className="comparison-tabs">
                <button className="tab active">基本信息</button>
                <button className="tab">材質與做工</button>
                <button className="tab">尺寸與合身度</button>
                <button className="tab">用戶評價</button>
              </div>
              
              <div className="comparison-tab-content">
                <div className="comparison-metric">
                  <h5>價格比較</h5>
                  <div className="metric-content">
                    <div className="metric-item">
                      <span className="label">原商品:</span>
                      <span className="value">${originalProduct?.new_price}</span>
                    </div>
                    <div className="metric-item">
                      <span className="label">推薦商品:</span>
                      <span className="value">${selectedForComparison.new_price}</span>
                    </div>
                    {calculateMetrics() && (
                      <div className="metric-item difference">
                        <span className="label">差異:</span>
                        <span className={`value ${calculateMetrics().price.better}`}>
                          {calculateMetrics().price.diff < 0 ? (
                            `便宜 $${Math.abs(calculateMetrics().price.diff).toFixed(2)} (${Math.abs(calculateMetrics().price.percent)}%)`
                          ) : calculateMetrics().price.diff > 0 ? (
                            `貴 $${calculateMetrics().price.diff.toFixed(2)} (${calculateMetrics().price.percent}%)`
                          ) : (
                            '價格相同'
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="comparison-metric">
                  <h5>類別比較</h5>
                  <div className="metric-content">
                    <div className="metric-item">
                      <span className="label">原商品:</span>
                      <span className="value">{originalProduct?.category}</span>
                    </div>
                    <div className="metric-item">
                      <span className="label">推薦商品:</span>
                      <span className="value">{selectedForComparison.category}</span>
                    </div>
                    {calculateMetrics() && (
                      <div className="metric-item difference">
                        <span className="label">差異:</span>
                        <span className={`value ${calculateMetrics().category.same ? 'equal' : 'different'}`}>
                          {calculateMetrics().category.same ? '相同類別' : '不同類別'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="comparison-metric">
                  <h5>AI 材質比較分析</h5>
                  <div className="metric-content">
                    {loadingMaterialComparison ? (
                      <div className="material-loading">
                        <span>🤖 AI 正在分析材質差異...</span>
                      </div>
                    ) : materialComparison ? (
                      <div className="material-comparison">
                        <div className="ai-analysis">
                          <span className="analysis-text">{materialComparison.comparison}</span>
                          <div className="analysis-meta">
                            <span className={`confidence ${materialComparison.confidence === '高' ? 'high' : 'low'}`}>
                              信心度: {materialComparison.confidence}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="material-unavailable">
                        <span>材質比較分析暫時不可用</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="comparison-actions">
              <button className="action-button back" onClick={closeComparisonModal}>返回</button>
              <button 
                className="action-button add-both" 
                onClick={handleAddBothToCart}
                disabled={addingToCart}
              >
                {addingToCart ? '添加中...' : '兩件都加入購物車'}
              </button>
              <Link to={`/product/${selectedForComparison.id}`} className="action-button view-recommended" onClick={handleClick}>
                查看推薦商品
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};