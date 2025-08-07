// 產品圖片映射表 - 根據實際商品資料精準匹配圖片
export const productImages = {
  // 1. 方領美型短袖上衣｜氣質粉紅｜修身彈性羅紋款 (女裝) - 粉紅色上衣
  1: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
  
  // 2. Nike 拼色運動短版背心｜棕白撞色設計｜街頭感休閒穿搭 (女裝) - 運動背心
  2: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center",
  
  // 3. 復古格紋絨面洋裝｜酒紅深V綁帶設計｜氣場女王款 (女裝) - 酒紅色洋裝
  3: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center",
  
  // 4. 格紋絨毛立領保暖外套｜深夜藍｜冬季時尚百搭款 (女裝) - 深藍色外套
  4: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop&crop=center",
  
  // 5. 經典直筒剪裁牛仔外套｜深藍水洗｜男士丹寧百搭單品 (男裝) - 牛仔外套
  5: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center",
  
  // 6. 男款防風拼色連帽外套｜戶外機能設計｜EXTREME ADVENTURE 印花款 (男裝) - 機能外套
  6: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop&crop=center",
  
  // 7. 經典修身男士皮革機車外套｜黑色立體剪裁｜搶眼金屬拉鍊設計 (男裝) - 黑色皮衣
  7: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
  
  // 8. 極簡純白連帽外套｜男款輕量保暖｜簡約機能風 (男裝) - 白色連帽外套
  8: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&crop=center",
  
  // 9. U-17 男孩圓領長袖T恤｜深藍色｜簡約印花休閒風 (童裝) - 深藍色T恤
  9: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center",
  
  // 10. 男童三色拼接連帽T｜深藍x白x芥黃｜親膚保暖刷毛款 (童裝) - 拼色連帽T
  10: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&crop=center",
  
  // 11. 男童休閒牛仔外套｜運動風徽章設計｜拉鍊圓領款 (童裝) - 童裝牛仔外套
  11: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&crop=center",
  
  // 12. 男童鋪棉連帽外套｜軍綠菱格紋設計｜內裡格紋襯裡保暖款 (童裝) - 軍綠外套
  12: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop&crop=center",
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
