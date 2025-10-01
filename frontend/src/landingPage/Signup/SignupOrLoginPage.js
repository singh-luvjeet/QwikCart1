import React, { useState } from 'react'
import image1 from '../../assets/img1.jpg';
import image2 from '../../assets/img2.jpg';
import image3 from '../../assets/img3.jpg';
import Signup from './Signup';
import Login from './Login';

const  SignupOrLoginPage=()=> {
    const [toggle, setToggle] = useState(false);
    console.log('toggle', toggle)
    function handleToggle(){
        setToggle((prev)=>!prev);
    }
    return (
      <>
      <div className='d-flex justify-content-center align-items-center containerParent'>
      <div className='container-md rounded  gradientC containerColor responsiveContainer'>
          <div className='row responsiveRow'>
  
  
            <div className='col-sm-12 col-md-6 d-flex justify-content-center align-items-center responsiveColumnA'>
            <div id="carouselExampleAutoplaying" className="carousel slide " data-bs-ride="carousel" >
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
              <div className="carousel-inner " >
                <div className="carousel-item active" data-bs-interval="2000">
                  <img src={image1} className="image " alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                  <h5>Welcome to QwikCart</h5>
                  </div>
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                  <img src={image2} className="image " alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                  <h5>Welcome to QwikCart</h5>
                  </div>
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                  <img src={image3} className="image " alt="..." />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Welcome to QwikCart</h5>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button"  data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button"  data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            </div>
  
  
  
  
            <div className='col-sm-12 col-md-6 py-3 px-3 d-flex justify-content-center align-items-center responsiveColumn'>
             {toggle ? <Signup setToggle={()=>handleToggle()} /> : <Login setToggle={()=>handleToggle()}/>}
            </div>
          </div> 
        </div>
      </div>
        
      </>
    );
  }

  export default SignupOrLoginPage;