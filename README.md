# 電商網站前端

這是電商網站的前端應用，使用 React 構建的現代化電商購物平台。

## 技術棧

- **React** - 前端框架
- **React Router** - 路由管理
- **Context API** - 狀態管理
- **CSS3** - 樣式設計
- **Fetch API** - HTTP 請求處理

## 主要功能

### 🏪 **商品展示**
- 商品列表展示
- 商品詳情頁面
- 分類瀏覽（男裝、女裝、童裝）
- 新品推薦
- 熱門商品展示

### 🛒 **購物功能**
- 購物車管理
- 商品數量調整
- 購物車結算
- 商品收藏

### 👤 **用戶功能**
- 用戶註冊
- 用戶登入
- JWT Token 認證
- 個人資料管理

### 🎨 **UI/UX 特色**
- 響應式設計
- 現代化界面
- 流暢的用戶體驗
- 商品圖片輪播
- 平滑滾動效果

## 頁面結構

```
src/
├── Components/          # 可重用組件
│   ├── Navbar/         # 導航欄
│   ├── Hero/           # 首頁橫幅
│   ├── Popular/        # 熱門商品
│   ├── NewCollections/ # 新品推薦
│   ├── ProductDisplay/ # 商品展示
│   ├── CartItems/      # 購物車項目
│   ├── Footer/         # 頁腳
│   └── ...
├── Pages/              # 頁面組件
│   ├── Shop.jsx        # 首頁
│   ├── ShopCategory.jsx # 分類頁面
│   ├── Product.jsx     # 商品詳情
│   ├── Cart.jsx        # 購物車
│   └── LoginSignup.jsx # 登入註冊
├── Context/            # 狀態管理
│   └── ShopContext.jsx # 全局狀態
└── Components/Assets/  # 靜態資源
```

## 環境變數

創建 `.env` 文件並設置：

```env
REACT_APP_API_URL=your_backend_api_url
```

## 本地開發

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發服務器：
```bash
npm start
```

3. 應用將在 `http://localhost:3000` 運行

## 構建部署

```bash
npm run build
```

## 部署到 Vercel

### 自動部署
1. 連接 GitHub repository
2. 設置環境變數 `REACT_APP_API_URL`
3. 自動部署

### 手動部署
```bash
npm install -g vercel
vercel
```

## 主要組件說明

### ShopContext
- 管理全局狀態（商品、購物車、用戶認證）
- 提供 API 調用方法
- 處理用戶登入狀態

### ProductDisplay
- 展示商品詳細信息
- 支持多圖片展示
- 尺寸選擇
- 加入購物車功能

### CartItems
- 購物車商品列表
- 數量調整
- 價格計算
- 結算功能

### Hero
- 首頁主要橫幅
- 點擊滾動到新品區域
- 響應式設計

## API 整合

前端與後端 API 的整合包括：

- 商品數據獲取
- 用戶認證
- 購物車操作
- 訂單處理

## 特色功能

### 商品描述格式化
- 支持多行文本顯示
- 中文內容適當換行
- HTML 安全處理

### 分類和標籤系統
- 動態分類顯示
- 標籤過濾
- 搜索功能

### 平滑滾動
- "Latest Collection" 按鈕自動滾動
- 流暢的用戶體驗

## 瀏覽器支援

- Chrome (推薦)
- Firefox
- Safari
- Edge

## 開發注意事項

- 確保後端 API 服務正常運行
- 設置正確的 CORS 配置
- 檢查環境變數配置
- 測試響應式設計

## 開發者

現代化電商前端解決方案，提供完整的購物體驗。
