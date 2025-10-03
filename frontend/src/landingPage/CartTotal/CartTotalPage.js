import { useState } from "react";
import CartTotal from "./CartTotal";
import Navbar from "../Navbar";
import Footer from "../Footer";

const CartTotalPage = () => {
    return (
        <>
            <Navbar/>
            <CartTotal/>
            <Footer/>
        </>
    )
}

export default CartTotalPage;