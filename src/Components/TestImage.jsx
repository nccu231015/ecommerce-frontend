import React from 'react';
import product1 from './Assets/product_1.png';

const TestImage = () => {
  console.log("測試圖片路徑:", product1);
  
  return (
    <div style={{ padding: '20px' }}>
      <h3>圖片測試</h3>
      <img 
        src={product1} 
        alt="Test Product" 
        style={{ width: '200px', height: '200px', border: '1px solid #ccc' }}
        onError={(e) => console.error("圖片載入失敗:", e.target.src)}
        onLoad={() => console.log("圖片載入成功:", product1)}
      />
      <p>圖片路徑: {product1}</p>
    </div>
  );
};

export default TestImage;
