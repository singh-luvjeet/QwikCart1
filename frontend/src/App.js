import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './landingPage/home/HomePage';
import ViewPage from './landingPage/ViewPage/ViewPage';
import SignupOrLoginPage from './landingPage/Signup/SignupOrLoginPage';
import { ToastContainer } from 'react-toastify';
import CartTotalPage from './landingPage/CartTotal/CartTotalPage';
import AddProductPage from './landingPage/AddProduct/AddProductPage';
import EditProductPage from './landingPage/EditProduct/EditProductPage';
import AddressListPage from './landingPage/Address/AddressListPage';
import ScrollToTop from './landingPage/ScrollToTop';
import ProfilePage from './landingPage/Profile/ProfilePage';


const App = ()=>{
  return(
  <BrowserRouter>
  <ToastContainer/>
  <ScrollToTop/>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<SignupOrLoginPage/>} />
      <Route path="/product/:id" element={<ViewPage />} />
      <Route path="/cart-total" element={<CartTotalPage/>} />
      <Route path="/add-product" element={<AddProductPage/>} />
      <Route path="/edit-product/:id" element={<EditProductPage/>} />
      <Route path="/address" element={<AddressListPage/>} />
      <Route path="/profile" element={<ProfilePage/>} />
    </Routes>
  </BrowserRouter>)
}

export default App;



