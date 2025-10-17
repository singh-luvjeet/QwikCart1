import React, { useState } from 'react'
import SideBar from './SideBar'
import Navbar from '../Navbar'
import Footer from '../Footer'
import EditForm from './EditForm'
import ChangePassword from './ChangePassword'
import MyWishlist from './MyWishlist'

const ProfilePage = () => {
  const [showComponent, setShowComponent] = useState(1)

  const handleClick1 = () => {
    setShowComponent(1)
  }
  const handleClick2 = () => {
    setShowComponent(2)
  }
  const handleClick3 = () => {
    setShowComponent(3)
  }

  return (
    <>
      <Navbar />

      <div style={{ height: '80vh' }} className='container mt-5 mb-5 border'>
        <div className='row'>
          <div className='col-4'>
            <SideBar
              click1={handleClick1}
              click2={handleClick2}
              click3={handleClick3}
            />
          </div>
          <div className='col-1'></div>
          <div className='col-7'>
            {
                showComponent===1?<EditForm/>:showComponent===2?<ChangePassword/>:<MyWishlist/> 
            }
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ProfilePage
