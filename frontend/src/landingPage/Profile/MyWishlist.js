import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../context/Cart'

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const { addToWishlist } = useContext(CartContext)

  const fetchData = async () => {
    const res = await axios.get('http://localhost:4000/wishlists', {
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
          <div className='d-flex justify-content-between align-items-center'>
            <img src={item.images[0]} style={{ width: '100px' }} />
            <h6>{item.title}</h6>
            <p>{item.description}</p>
            <button
              onClick={() => handleRemoveFromWishlist(item)}
              className='btn btn-success btn-small'
            >
              Remove
            </button>
          </div>
        )}
      </li>
    )
  })

  return <ul className='ulCard'>{wishlistItems}</ul>
}

export default MyWishlist
