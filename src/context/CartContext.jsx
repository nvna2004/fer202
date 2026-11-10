import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('fastfood_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('fastfood_cart', JSON.stringify(cartItems));
        } catch (e) {
            console.error('Không thể lưu giỏ hàng vào localStorage', e);
        }
    }, [cartItems]);

    const addToCart = (food, quantity = 1) => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(item => item.id === food.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                const currentQty = updated[existingIndex].quantity;
                const newQty = currentQty + quantity;
                if (food.quantity && newQty > food.quantity) {
                    alert(`Số lượng trong kho chỉ còn ${food.quantity} phần!`);
                    updated[existingIndex].quantity = food.quantity;
                } else {
                    updated[existingIndex].quantity = newQty;
                }
                return updated;
            } else {
                return [...prev, {
                    id: food.id,
                    name: food.name,
                    price: food.price,
                    image: food.image,
                    maxQuantity: food.quantity,
                    quantity: quantity
                }];
            }
        });
    };

    const updateQuantity = (foodId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(foodId);
            return;
        }
        setCartItems(prev => prev.map(item => {
            if (item.id === foodId) {
                if (item.maxQuantity && newQuantity > item.maxQuantity) {
                    alert(`Số lượng trong kho chỉ còn ${item.maxQuantity} phần!`);
                    return { ...item, quantity: item.maxQuantity };
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeFromCart = (foodId) => {
        setCartItems(prev => prev.filter(item => item.id !== foodId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            totalItems,
            subtotal
        }}>
            {children}
        </CartContext.Provider>
    );
};