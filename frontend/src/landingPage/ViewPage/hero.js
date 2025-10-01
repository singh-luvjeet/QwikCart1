import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/Cart"
import imga from '../../assets/imgA.png'
import imgb from '../../assets/imgB.png'
import imgc from '../../assets/imgC.png'
import imgd from '../../assets/imgD.png'

const Hero = () => {
  const [count, setCount] = useState(1);
  const { addToCart } = useContext(CartContext);

  const { id } = useParams(); // get the product id from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/cards/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const countPlus = () => {
    if(count>19){
      return;
    }
    setCount(count + 1);
  }
  const countMinus = () => {
    if (count <= 1) {
      return;
    }
    setCount(count - 1);
  }

  return (
    <>
      <div className='container' style={{ marginTop: '10vh' }}>
        <div className='row'>
          <div className='col-6'>
            <div className='viewHeroImageDiv d-flex justify-content-center align-items-center'>
              <img src={imga} className='imgA' alt='...' />
            </div>
            <div className='smallImgParent d-flex justify-content-between align-items-center'>
              <div className='smallImgA d-flex justify-content-center align-items-center'>
                <img src={imga} className='imgB ' alt='...' />
              </div>
              <div className='smallImgA d-flex justify-content-center align-items-center'>
                <img src={imgb} className='imgB' alt='...' />
              </div>
              <div className='smallImgA d-flex justify-content-center align-items-center'>
                <img src={imgc} className='imgB' alt='...' />
              </div>
              <div className='smallImgA d-flex justify-content-center align-items-center'>
                <img src={imgd} className='imgB' alt='...' />
              </div>
            </div>
          </div>

          <div className='col-1'></div>

          <div className='col-5'>
            <h1 className='fw-semibold'>{product.name}</h1>
            <p className='text-muted' style={{ fontSize: '10px' }}>
              {product.description}
            </p>
            <div
              className='cardStar mb-4'
              style={{ marginLeft: '0px', marginTop: '0px' }}
            >
              <span class='fa fa-star checked'></span>
              <span class='fa fa-star checked'></span>
              <span class='fa fa-star checked'></span>
              <span class='fa fa-star checked'></span>
              <span class='fa fa-star checked'></span>&nbsp;
              <span className='text-muted'>(121)</span>
            </div>
            <hr style={{ borderColor: '#f6dddd' }}></hr>
            <h4 className='fw-semibold'>${product.price}</h4>
            <p className='text-muted' style={{ fontSize: '10px' }}>
              Suggested payments with 6 months special financing
            </p>
            <hr style={{ borderColor: '#f6dddd' }}></hr>
            <h5 className=''>Choose a Color</h5>
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
                disabled={count===1}
               
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
                disabled={count===20}
                style={{
                  borderBottomRightRadius: '30px',
                  borderTopRightRadius: '30px',
                  marginRight: '20px'
                }}
              >
                +
              </button>

              <p className='text-muted lh-2' style={{ fontSize: '13px' }}>
                Only <span style={{ color: '#FA812F' }}>12 items</span> left!
                <br></br>Don't miss it
              </p>
            </div>
            <div className='d-flex justify-content-start'>
              <button
                class='btn viewBtn'
                onClick={() => addToCart(product, count)}
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

            <table className='mt-3 mb-5' style={{borderCollapse:"collapse", width:"100%"}}>
              <tr className='lh-1'>
              <td className='p-2' style={{border:"0.5px solid #f6dddd"}}>
                <p className='fw-semibold' style={{fontSize:"15px"}}><i class="fa fa-bus" style={{color: "#FA812F"}} aria-hidden="true"></i> &nbsp; Free Delivery</p>
                <p className='text-muted ms-4' style={{textDecoration:"underline", fontSize:"13px"}}>Enter your Postal code for Delivery availabilty</p>
              </td>
              </tr>
              <tr className='lh-1'>
              <td className='p-2' style={{border:"0.5px solid #f6dddd"}}>
                <p className='fw-semibold' style={{fontSize:"15px"}}><i class="fa fa-bookmark-o" style={{color: "#FA812F"}} aria-hidden="true"></i> &nbsp; Return Delivery</p>
                <p className='text-muted ms-4' style={{fontSize:"13px"}}>Free 30 days Delivery returns. <span style={{textDecoration:"underline"}}>Details</span></p>
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
