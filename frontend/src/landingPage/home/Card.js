import React, { useState, useEffect, useContext } from 'react'
import image8 from '../../assets/headphone.png'
import img9 from '../../assets/favorite.png'
import { Link } from 'react-router-dom';
import axios from "axios";
import { CartContext } from "../context/Cart"

const Card = () => {
  const [allCards, setAllCards] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const backendURL = "http://localhost:4000";
    axios.get(`${backendURL}/cards`).then((res) => {
      console.log(res.data);
      setAllCards(res.data);
    });
  }, []);


  const changeColor = (id) => {
    const updatedCard = allCards.map(card => 
      card._id === id ? {...card, liked: !card.liked} : card
    );
    setAllCards(updatedCard);
  }

  const cardItems = allCards.map(card => 
      <li key={card._id} >
      
      <div class='card cardWidth border border-0 m-2'>
        <div style={{position: "relative"}}>
        <Link to={`/product/${card._id}`} >
        <img src={image8} class='card-img-top cardImg' alt='...' />
        </Link>
        <div className='heartDiv' ></div>
        {card.liked ? <img src={img9} className='redHeart' onClick={() => changeColor(card._id)}/> : <i className="fa fa-heart-o cardHeart" onClick={() => changeColor(card._id)}  aria-hidden="true"></i>}
        
        </div>

        <div class='card-body'>
          <div className='d-flex justify-content-between cardDiv'>
            <h6 class='card-title mt-1 fw-semibold'>{card.name}</h6>
            <p className='dollar fw-semibold'>
              {card.price}<span className='zeros'></span>
            </p>
          </div>

          <p class='card-text text-muted cardP'>
            {card.description}
          </p>

          <div className='cardStar'>
            <span class='fa fa-star checked'></span>
            <span class='fa fa-star checked'></span>
            <span class='fa fa-star checked'></span>
            <span class='fa fa-star checked'></span>
            <span class='fa fa-star checked'></span>&nbsp;
            <span className='text-muted'>(121)</span>
          </div>

          <button class='btn cardBtn' onClick={() => addToCart(card)} >Add to Cart</button>
        </div>
      </div>
      </li>
  )
  return(
    <>
    <div className='cardsContainer'>
      <h3 className='h3Card fw-semibold'>Headphones For You!</h3>
       <ul className='ulCard d-flex flex-wrap mb-5'>{cardItems}</ul>
       </div>
    </>
  ) 
  
 
}

export default Card;
