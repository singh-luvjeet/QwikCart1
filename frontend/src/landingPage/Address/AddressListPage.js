import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import AddressForm from './AddressForm'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { toast, ToastContainer } from 'react-toastify'
import { CartContext } from '../context/Cart'
import { useNavigate } from 'react-router-dom'
import Checkout from './Checkout'

const AddressListPage = () => {
  const [addresses, setAddresses] = useState([])
  //store the list of all addresses fetched from your backend.
  //React needs to rerender the page whenever the list of addresses changes (like after adding, editing, or deleting an address).
  const [showModal, setShowModal] = useState(false)
  //track whether the Add/Edit Address form modal is visible or hidden.
  const [editingAddress, setEditingAddress] = useState(null)
  //track which address is being edited.
  //Initial value: null → no address is being edited initially
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  //to remember which address the user clicked (selected).
  const [showSuccessBox, setShowSuccessBox] = useState(false)

  const { currentUser, loadingUser, fetchCart } = useContext(CartContext)
  const navigate = useNavigate()


  useEffect(() => {
    if (!loadingUser && currentUser === null) {
      navigate('/login')
    }
  }, [currentUser, loadingUser, navigate])

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/address', {
        withCredentials: true
      })
      // { withCredentials: true }: This tells Axios to include cookies with the request.
      //without this - Browser won’t send cookies to the backend
      setAddresses(data)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // User is not authenticated → redirect to login
        navigate('/login')
      }
    }
  }
  

  useEffect(() => {
    if (!loadingUser && currentUser) {
      fetchAddresses()
    }
  }, [currentUser, loadingUser])


  if (loadingUser) return null;


  const handleEdit = addr => {
    setEditingAddress(addr)
    //Modal opens pre-filled with this address’s data.
    setShowModal(true)
  }

  const handleDelete = async addressId => {
    if (!window.confirm('Are you sure you want to delete this address?')) return
    try {
      await axios.delete(`http://localhost:4000/address/${addressId}`, {
        withCredentials: true
      })
      toast.success('Address deleted successfully!')
      fetchAddresses() // refresh list after deletion
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete address')
      //err.response?.data?.message -> Returns the backend error message if available
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select an address before placing the order");
      return;
    }
  
    try {
      const res = await axios.post(
        "http://localhost:4000/order/add",
        { addressId: selectedAddressId },
        { withCredentials: true }
      );
  
      console.log("Order placed:", res.data.order);
      toast.success("Order placed successfully!");
      setShowSuccessBox(true);
      fetchCart()
  
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error(err.response?.data?.error || "Failed to place order");
    }
  };
  

  const handleSelectAddress = addressId => {
    setSelectedAddressId(addressId)
  }
  //when a user clicks on an address card, we call this function and store that card’s _id in the state.

  return (
    <div>
      <Navbar />

      <div className='container' style={{ marginTop: '70px' }}>

        <Checkout/>
        <h1 className='fw-semibold mb-4 text-center'>Select Address</h1>
        <button
          className='btn viewBtn mb-5'
          onClick={() => {
            setEditingAddress(null)
            setShowModal(true)
          }}
        >
          + Add Address
        </button>

        <div className='addressList d-flex flex-wrap'>
          {addresses.map(addr => (
            <div
              key={addr._id}
              className={`card p-3 mb-5 me-5 d-flex flex-column justify-content-between  
            ${
              selectedAddressId === addr._id
                ? 'border border-success bg-light'
                : ''
            }`}
              style={{
                width: '20rem',
                cursor: 'pointer',
                boxShadow:
                  selectedAddressId === addr._id ? '0 0 10px green' : 'none',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleSelectAddress(addr._id)} // 👈 click to select
            >
              {addr.isDefault && (
                <span className='badge bg-success w-25 mb-3'>Default</span>
              )}
              <p>
                {addr.fullname}, {addr.phone}
              </p>
              <p>
                {addr.street}, {addr.city}, {addr.state}
              </p>
              <p>
                {addr.postalCode}, {addr.country}
              </p>

              <div className=''>
                <button
                  className='btn btn-sm me-2'
                  style={{
                    color: 'blue',
                    border: '0.5px solid green',
                    width: '70px'
                  }}
                  onClick={() => handleEdit(addr)}
                >
                  Edit
                </button>
                {!addr.isDefault && <button
                  className='btn btn-sm me-2'
                  style={{
                    color: 'red',
                    border: '0.5px solid green',
                    width: '70px'
                  }}
                  onClick={() => handleDelete(addr._id)}
                >
                  Delete
                </button>}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <AddressForm
            editAddress={editingAddress}
            onClose={() => setShowModal(false)}
            onSuccess={fetchAddresses}
          />
        )}
      </div>

      <div
        className='d-flex justify-content-center'
        style={{ marginBottom: '100px' }}
      >
        <button
          className='btn viewBtn w-25 '
          onClick={handlePlaceOrder}
        >
          Buy Now (Cash on Delivery)
        </button>
      </div>

      {showSuccessBox && (
        <div
          className='position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center'
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1050
          }}
        >
          <div
            className='bg-white p-5 rounded text-center shadow-lg'
            style={{ width: '350px' }}
          >
            <h4 className='mb-3'>&#127881; Order Placed!</h4>
            <p>Your order has been placed successfully.</p>
            <button
              className='btn btn-success mt-3' 
              onClick={() => {
                setShowSuccessBox(false);
                navigate("/orders"); 
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <ToastContainer position='top-center' />

      <Footer />
    </div>
  )
}

export default AddressListPage

// editAddress={editingAddress} -> Tells the form which address is being edited. If editingAddress is null, the form behaves as “Add New Address”. If it has an object, the form pre-fills the input fields so the user can edit the existing address.

// onClose={() => setShowModal(false)} -> lets the modal close itself after the user submits or cancels. The AddressForm (child component) itself cannot directly change the parent state (showModal), so we pass a function from the parent -> (In React, state is owned by the component where it is declared. showModal lives in the parent component (AddressListPage). Only the parent can directly call setShowModal() to change it. How the child can still “request” a change? We pass a function from the parent as a prop (onClose).) onClose={setShowModal(false)} -> Here, setShowModal(false) is executed immediately during render! Result: modal closes immediately, and clicking the Cancel button does nothing. () => setShowModal(false) wraps the function call so it’s not executed immediately.

//onSuccess={fetchAddresses} -> after a successful Add or Edit, we need to refresh the list of addresses shown on the page. The form itself doesn’t manage the list; the parent component (AddressListPage) does. So we pass a function from parent that fetches the latest addresses.
