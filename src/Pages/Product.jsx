import React, { useEffect } from 'react'
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { Breadcrum } from '../Components/Breadcrums/Breadcrum';
import { ProductDisplay } from '../Components/ProductDisplay/ProductDisplay';
import { DescriptionBox } from '../Components/DescriptionBox/DescriptionBox';

export const Product = () => {
  const {all_product} = useContext(ShopContext);
  const {productId} = useParams();
  const product = all_product.find((e)=> e.id === Number(productId));
  
  useEffect(() => {
    if (product) {
      console.log("載入的商品數據:", product);
      console.log("商品描述:", product.description);
      console.log("商品分類:", product.categories);
      console.log("商品標籤:", product.tags);
      console.log("商品基本分類:", product.category);
    }
  }, [product]);
  
  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox description={product?.description}/>
    </div>
  )
}
