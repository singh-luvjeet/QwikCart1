import React, { useContext, useState } from 'react'
import { CartContext } from './context/Cart'
import { Link, useNavigate } from 'react-router-dom'
import { useSearch } from './context/SearchContext';

const Navbar = () => {
  const { cartItems, currentUser } = useContext(CartContext)
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate()
  
  const handleSearch = e => {
    e.preventDefault()
    navigate('/')
  }

  // const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalItems = cartItems.length;

  const handleCartClick = e => {
    e.preventDefault()
    if (currentUser) {
      navigate('/cart-total')
    } else {
      navigate('/login')
    }
  }

  

  return (
    <>
      <div className='d-flex justify-content-around align-items-center navColor'>
        <div className='textColor'>
          <i class='fa fa-phone' aria-hidden='true'></i> &nbsp; +918568904700
        </div>

        <div className='textColor'>
          Get 50% off on Selected Items | Shop now
        </div>

        <div className='textColor'>
          <span>
            Eng <i class='fa fa-sort-desc' aria-hidden='true'></i>
          </span>{' '}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>
            Location <i class='fa fa-sort-desc' aria-hidden='true'></i>
          </span>
        </div>
      </div>

      <nav class='navbar navbar-expand-lg bg-body-tertiary '>
        <div class='container-fluid '>
          <Link class='navbar-brand ms-5' to='/'>
            <i
              class='fa fa-lg fa-shopping-cart iconColorN ms-5 me-2'
              aria-hidden='true'
            ></i>
            &nbsp;QwikCart
          </Link>
          <button
            class='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNavDropdown'
            aria-controls='navbarNavDropdown'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span class='navbar-toggler-icon'></span>
          </button>
          <div class='collapse navbar-collapse ' id='navbarNavDropdown'>
            <ul class='navbar-nav small ms-5'>
              <li class='nav-item '>
              <Link class='nav-link' to='/cart-total'>
                  Your Cart
                </Link>
              </li>
              <li class='nav-item ms-3'>
              <Link class='nav-link' to='/address'>
                  Your Addresses
                </Link>
              </li>
              <li class='nav-item ms-3'>
              <Link class='nav-link' to='/orders'>
                  Your Orders
                  </Link>
              </li>


              <form
                class='d-flex justify-content-end align-items-center'
                role='search'
                onSubmit={handleSearch}
              >
                <input
                  class='form-control me-5 searchNav ms-5'
                  type='search'
                  placeholder='Search'
                  aria-label='Search'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* <i class="fa fa-search searchIcon me-3 text-muted cursor" onClick={submitHandler} aria-hidden="true"></i> */}
                {/* <button class="btn btn-outline-success" type="submit">search</button> */}
              </form>
              <li className='nav-item ms-4'>
                {currentUser ? (
                  <Link to="/profile" style={{textDecoration:"none"}}>
                  <button className='btn btn-link nav-link'>
                    <i class='fa fa-user-o' aria-hidden='true'></i> Your Profile
                  </button>
                  </Link>
                ) : (
                  <Link className='nav-link' to='/login'>
                    <i class='fa fa-user-o' aria-hidden='true'></i> Login
                  </Link>
                )}
              </li>

              <li class='nav-item ms-4'>
                <Link
                  class='nav-link position-relative'
                  to='/cart-total'
                  onClick={handleCartClick}
                >
                  <i class='fa fa-shopping-cart' aria-hidden='true'></i> Cart
                  {totalItems > 0 && (
                    <span className='position-absolute top-0 start-100 navTranslate badge rounded-pill bg-success'>
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
