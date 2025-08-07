// 產品圖片映射表 - 使用網上的圖片作為示例
export const productImages = {
  1: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
  2: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
  3: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center",
  4: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop&crop=center",
  5: "https://images.unsplash.com/photo-1506629905607-bb5dd5b8c8e2?w=400&h=400&fit=crop&crop=center",
  6: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop&crop=center",
  7: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center",
  8: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&crop=center",
  9: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center",
  10: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop&crop=center",
  11: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&crop=center",
  12: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
};

// 生成其他產品的佔位圖片
for (let i = 13; i <= 36; i++) {
  const colors = ['3498db', 'e74c3c', '2ecc71', 'f39c12', '9b59b6', 'e67e22'];
  const color = colors[i % colors.length];
  productImages[i] = `https://via.placeholder.com/400x400/${color}/ffffff?text=Product+${i}`;
}

export const getProductImage = (productId) => {
  return productImages[productId] || `https://via.placeholder.com/400x400/cccccc/ffffff?text=Product+${productId}`;
};
