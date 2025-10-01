import React from 'react'
import Navbar from '../Navbar';
import Hero from './Hero';
import Card from './Card';
import Filters from './Filters';
import Footer from '../Footer';
import Pagination from './pagination';

const HomePage = () => {
    return (
        <>
            <Navbar/>
            <Hero />
            <Filters />
            <Card/>
            <Pagination/>
            <Footer/>
        </>
    )
}

export default HomePage;