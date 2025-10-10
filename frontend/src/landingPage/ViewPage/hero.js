import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { CartContext } from '../context/Cart'
import { toast } from 'react-toastify'

const Hero = () => {
  const [count, setCount] = useState(1)
  const [product, setProduct] = useState(null)
  const [selectedImg, setSelectedImg] = useState(0)
  const [loading, setLoading] = useState(true)
  const { id } = useParams() // get the product id from URL
  const { addToCart, currentUser } = useContext(CartContext)
  const navigate = useNavigate()

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:4000/cards/${id}`);
  //       setProduct(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching product:", error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchProduct();
  // }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/products/${id}`)
        console.log(response, 'view response')
        setProduct(response.data)
        setCount(response?.data?.minimumOrderQuantity)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  const handleImgChange = (i) => {
    setSelectedImg(i)
  }

  console.log(selectedImg, "selectedImg");

  const countPlus = () => {
    if (count > product.stock) return
    setCount(prev => prev + 1)
  }
  const countMinus = () => {
    if (count <= product.minimumOrderQuantity) {
      return
    }
    setCount(count - 1)
  }

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.info('Please login to add items to cart', { position: 'top-right' })
      navigate('/login') // redirect to login
      return
    }
    addToCart(product, count)
  }

  let AvgRating;
    let sum = 0;
    for(let i=0; i<product.reviews.length; i++){
      sum += product.reviews[i].rating;
    }
    AvgRating = sum/product.reviews.length;

  return (
    <>
      <div className='container' style={{ marginTop: '10vh' }}>
        <div className='row'>
          <div className='col-6'>
            <div className='viewHeroImageDiv d-flex justify-content-center align-items-center'>
              <img src={product.images[selectedImg]} className='imgA' alt='...' />
            </div>
            <div className='smallImgParent d-flex justify-content-evenly align-items-center'>
              {product.images.map((img, index) => (
                <div
                  
                  key={index}
                  className={`smallImgA d-flex justify-content-center align-items-center ${
                    selectedImg===index
                      ? 'border border-success bg-light'
                      : ''
                  }`}
                >
                  <img
                    src={img}
                    onClick={() => handleImgChange(index)} 
                    alt={`Product ${index}`}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '8px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='col-1'></div>

          <div className='col-5'>
            <h1 className='fw-semibold'>{product.title}</h1>
            <p className='text-muted' style={{ fontSize: '10px' }}>
              {product.description}
            </p>
            <div
              className='cardStar mb-4'
              style={{ marginLeft: '0px', marginTop: '0px' }}
            >
              {[1, 2, 3, 4, 5].map(i => (
                <span
                  key={i}
                  className={`fa fa-star ${
                    AvgRating >= i ? 'checked' : 'unchecked'
                  }`}
                ></span>
              ))}&nbsp;
              <span className='text-muted'>({product.reviews.length})</span>
            </div>
            <hr style={{ borderColor: '#f6dddd' }}></hr>
            <h4 className='fw-semibold mt-3'>${product.price}</h4>
            <p className='text-muted mb-3' style={{ fontSize: '10px' }}>
              Suggested payments with 6 months special financing
            </p>
            <hr style={{ borderColor: '#f6dddd' }}></hr>
            <h5 className='mt-3'>Choose a Color</h5>
            <div className='chooseColorParent d-flex justify-content-start'>
              <div className='chooseColor1'></div>
              <div className='chooseColor2'></div>
              <div className='chooseColor3'></div>
              <div className='chooseColor4'></div>
            </div>
            <hr style={{ borderColor: '#f6dddd' }}></hr>

            <div className='d-flex justify-content-start'>
              <button
                onClick={countMinus}
                className='counterButton'
                disabled={count === product.minimumOrderQuantity}
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
                onClick={countPlus}
                className='counterButton'
                disabled={count === product.stock}
                style={{
                  borderBottomRightRadius: '30px',
                  borderTopRightRadius: '30px',
                  marginRight: '20px'
                }}
              >
                +
              </button>

              <p className='text-muted lh-2' style={{ fontSize: '13px' }}>
                Only <span style={{ color: '#FA812F' }}>{product.stock}</span>{' '}
                left!
                <br></br>Don't miss it
              </p>
            </div>
            <div className='d-flex justify-content-start'>
              <button
                class='btn viewBtn'
                onClick={() => handleAddToCart(product)}
                style={{
                  marginRight: '40px',
                  marginLeft: '3px',
                  width: '175px'
                }}
              >
                Add to Cart
              </button>
              <button class='btn cardBtn' style={{ width: '175px' }}>
                Buy Now
              </button>
            </div>

            <table
              className='mt-3 mt-5 mb-5'
              style={{ borderCollapse: 'collapse', width: '100%' }}
            >
              <tr className='lh-1'>
                <td className='p-2' style={{ border: '0.5px solid #f6dddd' }}>
                  <p className='fw-semibold' style={{ fontSize: '15px' }}>
                    <i
                      class='fa fa-bus'
                      style={{ color: '#FA812F' }}
                      aria-hidden='true'
                    ></i>{' '}
                    &nbsp; Free Delivery
                  </p>
                  <p
                    className='text-muted ms-4'
                    style={{ textDecoration: 'underline', fontSize: '13px' }}
                  >
                    Enter your Postal code for Delivery availabilty
                  </p>
                </td>
              </tr>
              <tr className='lh-1'>
                <td className='p-2' style={{ border: '0.5px solid #f6dddd' }}>
                  <p className='fw-semibold' style={{ fontSize: '15px' }}>
                    <i
                      class='fa fa-bookmark-o'
                      style={{ color: '#FA812F' }}
                      aria-hidden='true'
                    ></i>{' '}
                    &nbsp; Return Delivery
                  </p>
                  <p className='text-muted ms-4' style={{ fontSize: '13px' }}>
                    Free 30 days Delivery returns.{' '}
                    <span style={{ textDecoration: 'underline' }}>Details</span>
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
