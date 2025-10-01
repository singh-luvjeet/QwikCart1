
import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './landingPage/home/HomePage';
import ViewPage from './landingPage/ViewPage/ViewPage';
import SignupOrLoginPage from './landingPage/Signup/SignupOrLoginPage';



const App = ()=>{
  return(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<SignupOrLoginPage/>} />
      <Route path="/product/:id" element={<ViewPage />} />
    </Routes>
  </BrowserRouter>)
}

export default App;



