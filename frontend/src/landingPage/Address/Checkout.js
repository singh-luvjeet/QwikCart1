import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
    const [cart, setCart] = useState([])
    const navigate = useNavigate()

    const fetchCart = async () => {
        try {
            const backendURL = 'http://localhost:4000'
            const res = await axios.get(`${backendURL}/cart`, { withCredentials: true })
            setCart(res.data.items)
      
            console.log('res.data.items checkout', res.data.items)
        } catch (err) {
            console.error('Error fetching cart:', err)
            if (err.response && err.response.status === 401) {
              navigate('/login')
            }
        }
    }

    useEffect(() => {
        fetchCart();
    },[])

    const finalTotal = cart.reduce((sum, item) => {
        if (item.isSelected) {
          return sum + item.product.price * item.quantity;
        }
        return sum;
      }, 0);

    return (
        
            <div style={{ margin: '80px 40px 80px 40px' }}>
            <h1 className='fw-semibold text-center mb-4'>Checkout</h1>
            <table className='table table-bordered table-striped'>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    
                </tr>
                </thead>
                <tbody>
                {cart.map(item => (
                    <>
                    {item.isSelected && (
                    <tr key={item.product._id}>
                    <td>{item.product.title}</td>
                    
                    <td>${item.product.price}</td>
                    <td>{item.quantity}</td>
                    <td>${item.product.price * item.quantity}</td>
                    
                    </tr>
                    )}
                    </>
                ))}
                </tbody>
            </table>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <h4>Final Total:&nbsp; ${finalTotal.toFixed(2)}</h4>
            </div>
            </div>
        
    )
}

export default Checkout;