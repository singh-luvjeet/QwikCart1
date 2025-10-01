import React from 'react'
import image7 from '../../assets/img4.png'

const Hero = () => {
  return (
    <>
      <div className='Container heroContainer'>
        <div className='row'>
          <div className='col-7 d-flex justify-content-center align-items-center flex-column leftHero'  >
            <h1 className='heroH2' >
              Grab Upto 50% Off On <br></br> Selected Headphones
            </h1>
            
            <div className='d-flex justify-content-start buttonDivHero' >
              <button type='button' class='btn buttonHero my-2'>
                Buy Now
              </button>
            </div>
          </div>

          <div className='col-5 d-flex justify-content-start align-items-end'>
            <img src={image7} className='imageHero' alt='..' />
          </div>
        </div>
      </div>


    </>
  )
}

export default Hero
