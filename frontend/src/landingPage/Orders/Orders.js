import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Orders = () => {

    const [product, setProduct] = useState(null)

    useEffect(() => {
        const fetchProduct = async () => {
          try {
            const res = await axios.get(`http://localhost:4000/order`, {withCredentials: true});
            // console.log("res order",res.data.orders)
            setProduct(res?.data?.orders);
          } catch (error) {
            console.error("Error fetching product:", error);
            // setLoading(false);
          }
        };
        fetchProduct();
      }, []);


    const orderItems = product?.map(order => {
        return (
            <li key={order._id}>
            <div className='container m-5 p-2 border'>
                <div className='row d-flex '>
                    <div className='col-6'>
                    {order.items.map(item => {
                        return (
                            <div key={item.productId.id} className='d-flex'>
                                <div className='me-5 col-4 d-flex align-items-center justify-content-center'>
                                    <img src={item.productId.images[0]} style={{ width: '100px' }} />
                                    
                                </div>
                                <div className=' ms-5 col-8 d-flex flex-column justify-content-center align-items-center'>
                                    <h5 className='fw-semibold'>{item.productId.title}</h5>
                                    <p className='text-muted '>{item.quantity} x {item.productId.price}</p>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                    <div className='p-3 col-6 d-flex flex-column justify-content-center align-items-center'>
                        <h5 className='fw-semibold text-center'>Address</h5>
                        <p>{order.address.fullname}, {order.address.phone}</p>
                        <p>{order.address.street}, {order.address.city}, {order.address.state}</p>
                        <p>{order.address.postalCode}, {order.address.country}</p>
                    </div>
                </div>
            </div>
            </li>
        )
    })

    return (
        <>
            <h1 className='m-5 text-center fw-semibold'>Your Orders</h1>
            <ul style={{marginBottom:"150px"}} className='wishlistUl'>{orderItems}</ul>
        </>
    )
}

export default Orders;