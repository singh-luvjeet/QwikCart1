import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './landingPage/home/HomePage';
import ViewPage from './landingPage/ViewPage/ViewPage';
import SignupOrLoginPage from './landingPage/Signup/SignupOrLoginPage';
import { ToastContainer } from 'react-toastify';
import CartTotalPage from './landingPage/CartTotal/CartTotalPage';
import AddProductPage from './landingPage/AddProduct/AddProductPage';


const App = ()=>{
  return(
  <BrowserRouter>
  <ToastContainer/>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<SignupOrLoginPage/>} />
      <Route path="/product/:id" element={<ViewPage />} />
      <Route path="/cart-total" element={<CartTotalPage/>} />
      <Route path="/add-product" element={<AddProductPage/>} />
    </Routes>
  </BrowserRouter>)
}

export default App;



