import  { createContext, useEffect, useState } from 'react';
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
const [cartItems,setCartItems]=useState({});
const [searchQuery, setSearchQuery] = useState("");
const addToCart = async (itemId) => {
  if (!cartItems[itemId]){
    setCartItems((prev)=>({...prev,[itemId]:1}))
  }
  else {
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
  }
  if (token) {
    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ foodId: itemId, quantity: 1 })
      });
    } catch (error) {
      console.error(error);
    }
  }
}

const removeFromeCart = async (itemId) => {
  const currentQuantity = cartItems[itemId];
  if (!currentQuantity) return;
  setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
  if (token) {
    try {
      const newQuantity = currentQuantity - 1;
      await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ foodId: itemId, quantity: newQuantity })
      });
    } catch (error) {
      console.error(error);
    }
  }
}

const getTotalCartAmount=()=>{
  let totalAmount=0;
  for(const item in cartItems)
  {
    if(cartItems[item]>0){
    let itemInfo =food_list.find((product)=>product._id===item);
    totalAmount += itemInfo.price * cartItems[item];
  }
}
return totalAmount;
}

  const [token, setToken] = useState("");

  const loadCartData = async (token) => {
    try {
      const response = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data && data.data.items) {
        let loadedCart = {};
        data.data.items.forEach(item => {
          loadedCart[item.food] = item.quantity;
        });
        setCartItems(loadedCart);
      }
    } catch (err) {
      console.error("Error loading cart", err);
    }
  };

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadCartData(token);
    } else {
      setCartItems({});
    }
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromeCart,
    getTotalCartAmount,
    searchQuery,
    setSearchQuery,
    token,
    setToken
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
