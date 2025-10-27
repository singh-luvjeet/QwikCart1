import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../context/Cart'
import { Link } from 'react-router-dom'

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const [count, setCount] = useState(1)
  const { addToWishlist, fetchCart, addToCart } = useContext(CartContext)

  const fetchData = async () => {
    const res = await axios.get('http://localhost:4000/wishlist', {
      withCredentials: true
    })
    // console.log('fetchData res.data >>', res.data.products)
    const mappedProduct = await res.data.products.map(product => {
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            images: product.images,
            liked: true,
            minimumOrderQuantity: product.minimumOrderQuantity,
            stock: product.stock,
            _id: product._id,
            
            
        }
    })
    setWishlist(mappedProduct);
    // console.log('mappedProduct', mappedProduct)
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handleAddToCart = (id, item, count) => {
    addToCart(item, count)
    fetchCart()
  }

  const countPlus = (id, stock) => {
    if (count > stock) return
    setCount(prev => prev + 1)
  }

  const countMinus = (id, minimumOrderQuantity) => {
    if (count <= minimumOrderQuantity) {
      return
    }
    setCount(count - 1)
  }
   
  // console.log("wishlist>>", wishlist)

  const handleRemoveFromWishlist = async item => {
    console.log('removing', item)

    const isLiked = item.liked
    console.log('isLiked from handleRemoveFromwishlist', isLiked)
    const res = await addToWishlist(item, isLiked)
    fetchData()
  }

  const wishlistItems = wishlist.map(item => {
    return (
      <li key={item._id}>
        {item.liked && (
          // <div className='container'>
          // <div className=' row d-flex justify-content-between align-items-center flex-fill'>
          //   <div className='col-2'>
          //   <img src={item.images[0]} style={{ width: '100px' }} />
          //   </div>
          //   {/* <div className='d-flex flex-column justify-content-center align-items-center p-2'>
          //     <h6 className='fw-semibold'>{item.title}</h6>
          //     <p>{item.description}</p>
          //   </div> */}
          //   <div className='col-4'>
          //   <h6 className='fw-semibold'>{item.title}</h6>
          //   </div>
          //   <div className='col-5'>
          //   <p>{item.description}</p>
          //   </div>
          //   <div className='col-1'>
          //   <button
          //     onClick={() => handleRemoveFromWishlist(item)}
          //     className='btn btn-success btn-sm '
          //     style={{borderRadius:"100%"}}
          //   >
          //     <i class="fa fa-trash-o" aria-hidden="true"></i>
          //   </button>
          //   </div>
          // </div>
          // </div>

          <div className='d-flex justify-content-between my-3'>
            <div className='d-flex justify-content-start'>
            <div className='wishlistImgDiv'>
              <img src={item.images[0]} style={{ width: '100px' }} />
            </div>
            <div className='ms-4 d-flex flex-column justify-content-center'>
              <div >{item.title}</div>
              <p className='text-muted' style={{fontSize:"13px", width:"300px"}}>{item.description}</p>
            </div>
            </div>
            <div className='d-flex flex-column justify-content-center align-items-center'>
            <button
              onClick={() => handleRemoveFromWishlist(item)}
              className='btn btn-danger btn-sm mb-2'
              style={{borderRadius:"100%"}}
            >
              <i class="fa fa-trash-o" aria-hidden="true"></i>
            </button>
            <div className='d-flex justify-content-start'>
              <button
                onClick={()=>countMinus(item.id, item.minimumOrderQuantity)}
                className='counterButton'
                disabled={count === item.minimumOrderQuantity}
                style={{
                  borderBottomLeftRadius: '30px',
                  borderTopLeftRadius: '30px',
                  fontSize: '20px'
                }}
              >
                -
              </button>
              <div className='counterDiv position-relative'>
                <p className='counterP'>{count}</p>
              </div>
              <button
                onClick={()=>countPlus(item.id ,item.stock)}
                className='counterButton'
                disabled={count === item.stock}
                style={{
                  borderBottomRightRadius: '30px',
                  borderTopRightRadius: '30px',
                  marginRight: '20px'
                }}
              >
                +
              </button>
            </div>
   
              <button
              class='btn btn-sm viewBtn'
              onClick={() => handleAddToCart(item.id, item, count)}
              style={{
                marginRight: '40px',
                marginLeft: '3px',
                width: '175px'
              }}
            >
              Add to Cart
            </button>
            </div>
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
