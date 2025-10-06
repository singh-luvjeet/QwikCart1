import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../context/Cart'

const CartTotal = () => {
  const [allCards, setAllCards] = useState([])
  const navigate = useNavigate()
  const { currentUser, loadingUser } = useContext(CartContext)

  useEffect(() => {
    if (!loadingUser && currentUser === null) {
      navigate('/login')
    }
  }, [currentUser, loadingUser, navigate])
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const backendURL = 'http://localhost:4000'
        const res = await axios.get(`${backendURL}/cart`, { withCredentials: true })
        setAllCards(res.data.items)
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

  const finalTotal = allCards.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <div style={{ margin: '150px 40px 150px 40px' }}>
      <h2>Your Cart</h2>
      <table className='table table-bordered table-striped'>
        <thead>
          <tr>
            <th>Name</th>
            <th className='text-center'>Rating</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {allCards.map(item => (
            <tr key={item._id}>
              <td>{item.product.name}</td>
              <td>
                <div className='cardStar d-flex justify-content-center align-items-end'>
                  <span className='fa fa-star checked'></span>
                  <span className='fa fa-star checked'></span>
                  <span className='fa fa-star checked'></span>
                  <span className='fa fa-star checked'></span>
                  <span className='fa fa-star checked'></span>&nbsp;
                  <span className='text-muted'>(121)</span>
                </div>
              </td>
              <td>${item.product.price}</td>
              <td>{item.quantity}</td>
              <td>${item.product.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <h4>Final Total:&nbsp; ${finalTotal}</h4>
      </div>
    </div>
  )
}

export default CartTotal
