import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import Hero from './Hero'
import Card from './Card'
import Filters from './Filters'
import Footer from '../Footer'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../context/SearchContext'

const HomePage = () => {
  const [allCards, setAllCards] = useState([])
  const [priceSort, setPriceSort] = useState('')
  const [selectedRating, setSelectedRating] = useState(1)
  const { searchTerm} = useSearch();
  // const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate()

  const handleRatingChange = event => {
    setSelectedRating(event.target.value)
  }

  // console.log('searchTerm', searchTerm)

  const fetchData = async (page) => {
    const response = await axios.get(
      `http://localhost:4000/cards?sort=${priceSort}&keyword=${searchTerm}&rating=${selectedRating}&page=${page}&limit=12&brand=${selectedBrand}&category=${selectedCategory}`,
      { withCredentials: true }
    )
    setAllCards(response.data.updatedCards)
    setTotalPages(response.data.totalPages);
    setCurrentPage(page);
  }

  // console.log('selectedBrand', selectedBrand)

  useEffect(() => {
    // console.log("Filters changed:", { priceSort, searchTerm, selectedRating, selectedBrand, selectedCategory })
    fetchData(1)
  }, [priceSort,searchTerm, selectedRating, selectedBrand, selectedCategory])

  const handlePageChange = (page) => fetchData(page);

  console.log('allCards', allCards)

  return (
    <>
      <Navbar
        // handleSearch={handleSearch}
        // searchTerm={searchTerm}
        // setSearchTerm={setSearchTerm}
      />
      <Hero />
      <Filters
        priceSort={priceSort}
        setPriceSort={setPriceSort}
        selectedRating={selectedRating}
        handleRatingChange={handleRatingChange}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Card
        setAllCards={setAllCards}
        allCards={allCards}
        fetchData={fetchData}
        selectedRating={selectedRating}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
      />
      <Footer />
    </>
  )
}

export default HomePage
