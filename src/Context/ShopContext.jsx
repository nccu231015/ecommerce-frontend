import React, { useEffect } from "react";
import { createContext } from "react";
import { useState } from "react";

export const ShopContext = createContext(null);
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
}

export const ShopContextProvider = (props) => {

    const [all_product, setAllProduct] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/allproduct`)
        .then((response)=> response.json())
        .then((data)=>{
            console.log("從 API 獲取的產品數據:", data);
            setAllProduct(data);
        })

        if(localStorage.getItem("auth-token")){
            fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/getcart`, {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "Content-Type": "application/json",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                },
                body: "",
            }).then((response) => response.json())
            .then((data) => setCartItems(data))
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1}));
        if(localStorage.getItem("auth-token")){
            fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/addtocart`, {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "Content-Type": "application/json",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                },
                body: JSON.stringify({"itmeId":itemId}),
            })
            .then((response) => response.json())
            .then((data)=>console.log(data));
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1}));
         if(localStorage.getItem("auth-token")){
            fetch(`${process.env.REACT_APP_API_URL || "http://localhost:4000"}/removefromcart`, {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "Content-Type": "application/json",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                },
                body: JSON.stringify({"itmeId":itemId}),
            })
            .then((response) => response.json())
            .then((data)=>console.log(data));
        }       
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                totalAmount += cartItems[item] * itemInfo.new_price;
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
            totalItems += cartItems[item];
        }
    }
        return totalItems;
    }

    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}