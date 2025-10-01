import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('http://localhost:4000/current-user', {
        withCredentials: true
      })
      setCurrentUser(res.data)
    } catch (err) {
      setCurrentUser(null)
      console.error(err)
    }
  }

  // You have to load the current user from the backend first, otherwise you don’t know which user is logged in.
  useEffect(() => {
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) return
      try {
        const res = await axios.get('http://localhost:4000/cart', {
          withCredentials: true
        })
        setCartItems(res.data.items || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchCart()
  }, [currentUser])

  const addToCart = async (product, quantity) => {
    const res = await axios.post(
      'http://localhost:4000/cart/add',
      { productId: product._id, quantity },
      { withCredentials: true }
    )
    setCartItems(res.data.items)
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}

// export const CartProvider = ({ children }) => {
// const [cartItems, setCartItems] = useState(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [])

// const addToCart = (item) => {
//   const isItemInCart = cartItems.find((cartItem) => cartItem._id === item._id);

//   if (isItemInCart) {
//     setCartItems(
//       cartItems.map((cartItem) =>
//         cartItem._id === item._id
//           ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
//           : cartItem
//       )
//     );
//   } else {
//     setCartItems([...cartItems, { ...item }]);
//   }
// };

// useEffect(() => {
//   localStorage.setItem("cartItems", JSON.stringify(cartItems));
// }, [cartItems]);

// useEffect(() => {
//   const cartItems = localStorage.getItem("cartItems");
//   if (cartItems) {
//     setCartItems(JSON.parse(cartItems));
//   }
// }, []);

// return (
//   <CartContext.Provider
//     value={{
//       cartItems,
//       addToCart,
//     }}
//   >
//     {children}
//   </CartContext.Provider>
// );
// };
