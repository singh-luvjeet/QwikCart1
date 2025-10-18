import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../context/Cart'

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const { addToWishlist } = useContext(CartContext)

  const fetchData = async () => {
    const res = await axios.get('http://localhost:4000/wishlist', {
      withCredentials: true
    })
    console.log('fetchData res.data >>', res.data.products)
    const mappedProduct = await res.data.products.map(product => {
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            images: product.images,
            liked: true
        }
    })
    setWishlist(mappedProduct);
  }
  useEffect(() => {
    fetchData()
  }, [])

  console.log("wishlist>>", wishlist)

  const handleRemoveFromWishlist = async item => {
    console.log('removing', item)

    const isLiked = item.liked
    console.log('isLiked from handleRemovetowishlist', isLiked)
    const res = await addToWishlist(item, isLiked)
    fetchData()
  }

  const wishlistItems = wishlist.map(item => {
    return (
      <li key={item._id}>
        {item.liked && (
          <div className='d-flex justify-content-between align-items-center flex-fill'>
            <img src={item.images[0]} style={{ width: '100px' }} />
            <div className='d-flex flex-column justify-content-center align-items-center p-2'>
              <h6 className='fw-semibold'>{item.title}</h6>
              <p>{item.description}</p>
            </div>
            <button
              onClick={() => handleRemoveFromWishlist(item)}
              className='btn btn-success btn-sm '
              style={{borderRadius:"100%"}}
            >
              x
            </button>
          </div>
        )}
      </li>
    )
  })

  return <>
    <div className='py-5 pe-3 overflow-auto' style={{height:"70vh"}}>
    <h2 className='fw-semibold mb-4' style={{marginLeft:"313px"}}>My Wishlist</h2>
    <ul className='wishlistUl '>{wishlistItems}</ul>
    </div>
  </>
}

export default MyWishlist
