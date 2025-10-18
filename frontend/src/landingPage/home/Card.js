import React, { useState, useEffect, useContext } from 'react'
import image8 from '../../assets/headphone.png'
import img9 from '../../assets/favorite.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CartContext } from '../context/Cart'
import { toast } from 'react-toastify'
import Pagination from './pagination'

const Card = ({allCards, setAllCards, fetchData, totalPages,handlePageChange,currentPage}) => {
  // const [allCards, setAllCards] = useState([]);
  // const [current, setCurrent] = useState(1);
  // const [isLiked, setIsLiked] = useState(false);
  const { addToCart, currentUser, addToWishlist } = useContext(CartContext)
  

  const navigate = useNavigate()

  // const fetchData = async() =>{

  //   const res = await axios.get('http://localhost:4000/cards',{withCredentials: true })
  //   console.log("fetchData res.data >>",res.data)
  //   setAllCards(res.data);
  // }
  // useEffect( () => {

  //   fetchData()

  // }, [current]);

  // const handlePageChange = (current) => {
  //   setCurrent(current);
  // }

//   let skip = (current - 1)*12;
//   // ?limit=12&skip=${skip}
//   const fetchData = async () => {
//   const res = await axios.get(`https://dummyjson.com/products?limit=30&skip=30`);
//   console.log("full data>>",res.data.products)
//   const mappedProduct = await res.data.products.map(product => {

//       let AvgRating;
//       let sum = 0;
//       for(let i=0; i<product.reviews.length; i++){
//         sum += product.reviews[i].rating;
//       }
//       AvgRating = Math.floor(sum/product.reviews.length);
//       return {
//         id: product.id,
//         title: product.title,
//         description: product.description,
//         price: product.price,
//         stock: product.stock,
//         brand: product.brand,
//         images: product.images,
//         AvgRating: AvgRating,
//         ratingLength: product.reviews.length,
//         // reviews: product.reviews,
//         minimumOrderQuantity: product.minimumOrderQuantity
//       }
//     })
//     setAllCards(mappedProduct);
//   }

//   const handleImportProducts = async () => {
//     try {
//       console.log("pushing cards", allCards)
//         await axios.post('http://localhost:4000/import', {allCards});
//         alert('Products successfully pushed to MongoDB!');
//     } catch (error) {
//         console.error('Error pushing products to MongoDB:', error);
//         alert('Failed to push products to MongoDB.');
//     }
// };


//   useEffect(() => {
//     fetchData();
//   }, [current])


  // const changeColor = id => {
  //   const updatedCard = allCards.map(card =>
  //     card.id === id ? { ...card, liked: !card.liked } : card
  //   )
  //   setAllCards(updatedCard)
  // }

  // const handleAddToCart = card => {
  //   if (!currentUser) {
  //     toast.info('Please login to add items to cart', { position: 'top-right' })
  //     navigate('/login')
  //     return
  //   }
  //   addToCart(card, 1)
  // }

  const handleAddToWishlist = async (card) => {
    console.log("clicked add ", card)
    if (!currentUser) {
      toast.info('Please login to add items to Wishlist', { position: 'top-right' })
      navigate('/login')
      return
    }
    const isLiked = card.liked
    // setIsLiked(!isLiked);
    console.log("isLiked from handleaddtowishlist", isLiked)
    const res = await addToWishlist(card, isLiked)
    fetchData()

  }
    const handleRemoveFromWishlist = async (card) => {
      console.log("removing", card)
      if (!currentUser) {
        toast.info('Please login to add items to Wishlist', { position: 'top-right' })
        navigate('/login')
        return
      }
      // setIsLiked(!isLiked);
      const isLiked = card.liked
      console.log("isLiked from handleRemovetowishlist", isLiked)
      const res = await addToWishlist(card, isLiked)
      fetchData()

    

    // const updatedCard = allCards.map(card =>
    //   card.id === id ? { ...card, liked: !card.liked } : card
    // )
    // setAllCards(updatedCard)
  }

  // const handleDelete = async id => {
  //   if (!window.confirm('Are you sure you want to delete this product?')) return
  //   try {
  //     await axios.delete(`http://localhost:4000/cards/${id}/delete`, {
  //       withCredentials: true
  //     })
  //     setAllCards(prev => prev.filter(card => card._id !== id))
  //     toast.success('Product deleted successfully', { position: 'top-right' })
  //   } catch (err) {
  //     console.error(err)
  //     toast.error('Failed to delete product', { position: 'top-right' })
  //   }
  // }
  // console.log("search query>>", searchQuery)

//   const filteredCards = allCards.filter(product =>{
//     product.title.toLowerCase().includes(searchQuery.toLowerCase())
// })

// const filteredCards = allCards.filter((product) => {
//   if (selectedRating === 'all') {
//     return true; // Show all products
//   }
//   return product.AvgRating >= selectedRating;
// });

  // const cardItems = filteredCards.map(card => {
    const cardItems = allCards.map(card => {
    const isOwner = currentUser && currentUser._id === card.owner // check ownership
    return (
      <li key={card.id}>
        <div className='card cardWidth border border-0 m-2 '>
          <div style={{ position: 'relative' }}>
            <Link to={`/product/${card._id}`}>
              <img
                src={card.images?.[0] || image8}
                loading='lazy'
                className='card-img-top cardImg'
                onError={e => (e.target.src = image8)}
                alt='...'
              />
            </Link>
            <div className='heartDiv'></div>
            {card.liked ? (
              <img
                src={img9}
                className='redHeart '
                onClick={() => handleRemoveFromWishlist(card)}
              />
            ) : (
              <i
                className='fa fa-heart-o cardHeart '
                
                onClick={() => handleAddToWishlist(card)}
                aria-hidden='true'
              ></i>
            )}
          </div>

          <div className='card-body'>
            <div className='d-flex justify-content-between cardDiv'>
              <h6 className='card-title mt-1 fw-semibold'>{card.title}</h6>
              <p className='dollar fw-semibold'>
                {card.price}
                <span className='zeros'></span>
              </p>
            </div>

            <p className='card-text text-muted cardP'>{`${card.description.slice(0,65)+"..."}`}</p>

            <div className='cardStar'>
               
                {[1,2,3,4,5].map((i)=>(<span key={i} className={`fa fa-star ${card.AvgRating>=i?"checked":"unchecked"}`}></span>))}
            
              
              {/* <span className={`fa fa-star checked`}></span>
              <span className={`fa fa-star checked`}></span>
              <span className={`fa fa-star checked`}></span>
              <span className={`fa fa-star checked`}></span>
              <span className={`fa fa-star ${card.AvgRating>=1?"checked":"unchecked"}`}></span>&nbsp; */}
              {/* <span className='text-muted'>&nbsp;({card.ratingLength})</span> */}
              <span className='text-muted'>&nbsp;(3)</span>
            </div>

            {isOwner ? (
              <div className='d-flex justify-content-between'>
                <button
                  className='btn cardBtnEdit  mt-2'
                  onClick={() => navigate(`/edit-product/${card._id}`)}
                >
                  Edit
                </button>
                {/* <button
                  className='btn cardBtnDelete mt-2'
                  onClick={() => handleDelete(card._id)}
                >
                  Delete
                </button> */}
              </div>
            ) : (
              <Link to={`/product/${card._id}`}>
              <button
                className='btn cardBtn mt-2'
                // onClick={() => handleAddToCart(card)}
              >
                Add to Cart
              </button>
              </Link>
            )}
          </div>
        </div>
      </li>
    )
  })

  return (
    <>
    <div className='cardsContainer'>
      <h3 className='h3Card fw-semibold'>Products For You!</h3>
      {/* <button onClick={handleImportProducts}>button</button> */}
      <ul className='ulCard d-flex flex-wrap mb-5'>{cardItems}</ul>
    </div>
    <Pagination
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        currentPage={currentPage}/>
    </>
  )
}

export default Card;


