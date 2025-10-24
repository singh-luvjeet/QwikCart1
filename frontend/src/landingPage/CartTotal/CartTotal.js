import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { CartContext } from '../context/Cart'

const CartTotal = () => {
  const [cart, setCart] = useState([])
  const [selectedItems, setSelectedItems] = useState({})
  const navigate = useNavigate()
  const { currentUser, loadingUser } = useContext(CartContext)

  // Redirect if not logged in
  useEffect(() => {
    if (!loadingUser && currentUser === null) {
      navigate('/login')
    }
  }, [currentUser, loadingUser, navigate])
  
  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const backendURL = 'http://localhost:4000'
        const res = await axios.get(`${backendURL}/cart`, { withCredentials: true })
        setCart(res.data.items)

        console.log('res.data.items cartTotal', res.data.isSelected)

        // Select all items by default
        const initialSelection = {}
        res.data.items.forEach(item => {
          initialSelection[item.product._id] = item.isSelected
        })
        //forEach goes through each cart item in the array. For each item: product._id is used as the key in the object. true is set as the value, meaning the item is selected by default.
        setSelectedItems(initialSelection)
      } catch (err) {
        console.error('Error fetching cart:', err)
        if (err.response && err.response.status === 401) {
          navigate('/login')
        }
      }
    }
  
    if (!loadingUser && currentUser) {
      fetchCart()
    }
  }, [currentUser, loadingUser, navigate])

  console.log('selectedItems', selectedItems)
const handleCheckboxChange = async (productId) => {
  const newSelected = !selectedItems[productId];

  setSelectedItems(prev => ({
    ...prev,
    [productId]: newSelected,
  }));

  console.log("Toggled:", productId, "New value:", newSelected);

  try {
    await axios.put("http://localhost:4000/cart/selected", {
      productId,
      isSelected: newSelected,
    }, { withCredentials: true });
  } catch (err) {
    console.error("Error updating selected item:", err);
  }
};

  // console.log('cart', cart)
  const finalTotal = cart.reduce(
    (sum, item) => sum + (selectedItems[item.product._id] ? item.product.price * item.quantity : 0),
    0
  )

  return (
    <div style={{ margin: '80px 40px 80px 40px' }}>
      <h1 className='fw-semibold text-center mb-4'>Your Cart</h1>
      <table className='table table-bordered table-striped'>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th className='text-center'>Rating</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item._id}>
              <td className='text-center'>
                <input
                  type="checkbox"
                  checked={selectedItems[item.product._id] || false}
                  onChange={() => handleCheckboxChange(item.product._id)}
                  style={{ accentColor: 'green', width: '20px', height: '20px' }}
                />
              </td>
              <td>{item.product.title}</td>
              <td>
                <div className='cardStar d-flex justify-content-center align-items-end'>
                {[1, 2, 3, 4, 5].map(i => (
                <span
                  key={i}
                  className={`fa fa-star ${
                    item.product.AvgRating >= i ? 'checked' : 'unchecked'
                  }`}
                ></span>
                
              ))}
                  {/* <span className='fa fa-star checked'></span>
                  <span className='fa fa-star checked'></span>
                  <span className='fa fa-star checked'></span>
                  <span className='fa fa-star checked'></span>
                  <span className='fa fa-star checked'></span> */}
                  &nbsp;<span className='text-muted'>(3)</span>
                </div>
              </td>
              <td>${item.product.price}</td>
              <td>{item.quantity}</td>
              <td>${item.product.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <h4>Final Total:&nbsp; ${finalTotal}</h4>
      </div>
      
      <Link to="/address" className='text-decoration-none'>
        <div className='d-flex justify-content-center mt-5'>
          <button className='btn viewBtn w-25'>Checkout</button>
        </div>
      </Link>
    </div>
  )
}

export default CartTotal
