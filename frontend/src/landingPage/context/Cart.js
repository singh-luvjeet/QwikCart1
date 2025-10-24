import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [itemsChange, setItemsChange] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      // console.log("Fetching current user...")
      const res = await axios.get('http://localhost:4000/current-user', {
        withCredentials: true
      })
      // console.log("Current user fetched:", res.data)
      setCurrentUser(res.data)
    } catch (err) {
      console.error("Error fetching current user:", err)
      setCurrentUser(null)
      setCartItems([])
    } finally {
      setLoadingUser(false) 
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const fetchCart = async () => {
    if (!currentUser) {
      // console.log("No current user, clearing cart")
      setCartItems([])
      return
    }
    try {
      // console.log(`Fetching cart for user ${currentUser._id}`)
      const res = await axios.get('http://localhost:4000/cart', {
        withCredentials: true
      })
      // console.log("Cart fetched:", res.data.items)
      setCartItems(res.data.items || [])
      setItemsChange(!itemsChange);
    } catch (err) {
      console.error("Error fetching cart:", err)
      setCartItems([])
    }
  }

  useEffect(() => {
    
    fetchCart()
  }, [currentUser]) 


  // console.log('cartItems', cartItems)

  const logout = async () => {
    try {
      await axios.post('http://localhost:4000/logout', {}, { withCredentials: true });
      setCurrentUser(null);
      setCartItems([]);
      console.log("User logged out successfully");
      toast.success("You have logged out successfully!", { position: "top-center" })
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const addToWishlist = async(product, liked) => {
    if (!currentUser){
      console.log("No user logged in, cannot add to cart")
      return
    } 
    // console.log(`Adding product ${product.id} to wishlist`);
    try{
        const res = await axios.post(
        'http://localhost:4000/wishlist/add',
        {productId: product.id, liked: !liked},
        {withCredentials: true}
      )

      return res
    }
    catch(err){
      console.error("Error adding to wishlist:", err)
    }
  }


  const addToCart = async (product, quantity) => {
    if (!currentUser){
      console.log("No user logged in, cannot add to cart")
      return
    } 
    try {
      // console.log(`Adding product ${product._id} (qty: ${quantity}) to cart for user ${currentUser._id}`)
      const res = await axios.post(
        'http://localhost:4000/cart/add',
        { productId: product._id, quantity },
        { withCredentials: true }
      )
      console.log("Cart updated:", res.data.items)
      setCartItems(res.data.items)
    } catch (err) {
      console.error("Error adding to cart:", err)
    }
  }


  return (
    <CartContext.Provider value={{ cartItems, fetchCart, addToCart, currentUser, setCurrentUser, logout, loadingUser, wishlistItems, addToWishlist  }}>
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
