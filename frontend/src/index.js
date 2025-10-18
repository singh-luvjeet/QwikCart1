import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './landingPage/context/Cart';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SearchProvider } from './landingPage/context/SearchContext';

const clientId = "144563076261-dn1lnei7eram10465q5vfel8lvn74u1n.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>
    <SearchProvider>
      <GoogleOAuthProvider clientId={clientId}>
      <App/>
      </GoogleOAuthProvider>
      </SearchProvider>
    </CartProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
