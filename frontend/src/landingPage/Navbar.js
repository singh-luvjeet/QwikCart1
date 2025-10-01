import React, { useContext } from 'react'
import { CartContext } from './context/Cart';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  function submitHandler(e){
      e.preventDefault();
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
          <a class='navbar-brand ms-5' href='#'>
          <i class="fa fa-lg fa-shopping-cart iconColorN ms-5 me-2" aria-hidden="true"></i>&nbsp;QwikCart
          </a>
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
                <li class='nav-item dropdown '>
                <a
                  class='nav-link dropdown-toggle'
                  href='#'
                  role='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  Dropdown link
                </a>
                <ul class='dropdown-menu'>
                  <li>
                    <a class='dropdown-item' href='#'>
                      Action
                    </a>
                  </li>
                  <li>
                    <a class='dropdown-item' href='#'>
                      Another action
                    </a>
                  </li>
                  <li>
                    <a class='dropdown-item' href='#'>
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
              <li class='nav-item ms-3'>
                <a class='nav-link' aria-current='page' href='#'>
                  Deals
                </a>
              </li>
              <li class='nav-item ms-3'>
                <a class='nav-link' href='#'>
                  What's New
                </a>
              </li>
              <li class='nav-item ms-3 me-4'>
                <a class='nav-link' href='#'>
                  Delivery
                </a>
              </li>  
            
            <form class="d-flex justify-content-end align-items-center" role="search">
        <input class="form-control me-5 searchNav ms-5" type="search" placeholder="Search" aria-label="Search"/>
        {/* <i class="fa fa-search searchIcon me-3 text-muted cursor" onClick={submitHandler} aria-hidden="true"></i> */}
        {/* <button class="btn btn-outline-success" type="submit">search</button> */}
      </form>
      <li class='nav-item ms-4'>
                <a class='nav-link' href='#'>
                <i class="fa fa-user-o" aria-hidden="true"></i>&nbsp;Account
                </a>
              </li> 

              <li class='nav-item ms-4'>
                <a class='nav-link position-relative' href='#'>
                <i class="fa fa-shopping-cart" aria-hidden="true"></i> Cart
                {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 navTranslate badge rounded-pill bg-success">
                  {totalItems}
                </span>
              )}
                  </a>
              </li>
      </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
