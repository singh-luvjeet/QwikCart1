import React from 'react'
import image4 from '../assets/go.png'
import image5 from '../assets/gi.png'
import image6 from '../assets/f.png'

const Footer = () => {
  return (
    <>
      <div className='container-fluid footerFluid mt-5'>
        <div className='container p-5'>
          <div className='row'>
            <div className='col-3'>
              <p className='fw-semibold fs-4 lh-1'>1800 102 2777</p>
              <button className='btn rounded-pill footerbtn'>
                <i class='fa fa-headphones' aria-hidden='true'></i>
                &nbsp;&nbsp;Chat Support
              </button>
              <p className='footerColor footerText lh-1 mt-2'>
                9:00-21:00, MON-SUN<br></br>
                Including Holidays
              </p>

              <div className='d-flex justify-content-start align-items-center mt-4'>
                <img src={image4} className='google1 me-2' alt='..' />
                <img src={image5} className='github1 me-2' alt='..' />
                <img src={image6} className='facebook1 me-2' alt='..' />
              </div>
            </div>

            <div className='col-3'>
              <h6 className='fw-semibold mb-3'>Products</h6>
              <div className='footerColor footerText '>
              <span  className="anchor mb-1">realme Phones</span>
              <br></br>
              <span  className="anchor mb-1">Smartwatch</span>
              <br></br>
              <span  className="anchor mb-1">Buds</span>
              <br></br>
              <span  className="anchor mb-1">Accessories</span>
              <br></br>
              <span  className="anchor mb-1">realme Care+</span>
              <br></br>
              </div>
            </div>

            <div className='col-3'>
              <h6 className='fw-semibold mb-3'>Support</h6>
              <div className='footerColor footerText '>
              <span  className="anchor mb-1">FAQ</span>
              <br></br>
              <span  className="anchor mb-1">Email Us</span>
              <br></br>
              <span  className="anchor mb-1">User Guide</span>
              <br></br>
              <span  className="anchor mb-1">User Manuals
              </span>
              <br></br>
              <span  className="anchor mb-1">Warranty Policy</span>
              <br></br>
              <span  className="anchor mb-1">Service Centers
              </span>
              <br></br>
              <span  className="anchor mb-1">UI 5.0</span>
              <br></br>
              <span  className="anchor mb-1">UI 6.0</span>
              <br></br>
              </div>
            </div>

            <div className='col-3'>
              <h6 className='fw-semibold mb-3'>About QwikCart</h6>
              <div className='footerColor footerText '>
              <span  className="anchor mb-1">Our Brand</span>
              <br></br>
              <span  className="anchor mb-1">Community</span>
              <br></br>
              <span  className="anchor mb-1">App Download</span>
              <br></br>
              <span  className="anchor mb-1">Retail Store
              </span>
              <br></br>
              <span  className="anchor mb-1">Newsroom</span>
              <br></br>
              <span  className="anchor mb-1">realmeow
              </span>
              <br></br>
              <span  className="anchor mb-1">Declaration and Disclosure</span>
              <br></br>
              </div>
            </div>
          </div>

          <hr></hr>
          <p style={{color:"white"}} className='mt-2 text-center'>&copy; QwikCart Private Limited</p>
        </div>
      </div>
    </>
  )
}

export default Footer
