import React, { useContext } from 'react'
import { CartContext } from '../context/Cart';


const SideBar = ({click1, click2, click3}) => {
    const {logout} = useContext(CartContext);
    return (
        <>
            <div style={{height:"70vh", width:"auto", margin:"30px"}} className='p-5 border border-success container d-flex flex-column justify-content-around'>
                <button onClick={click1} className='btn btn-success'>Edit profile</button>
                
                <button onClick={click2} className='btn btn-success'>Change Password</button>
                
                
                <button onClick={click3} className='btn btn-success'>My Wishlist</button>
               

                <button onClick={logout} className='btn btn-success'>Logout</button>
            </div>
        </>
    )
}

export default SideBar;