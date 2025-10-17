import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import Hero from './Hero'
import Card from './Card'
import Filters from './Filters'
import Footer from '../Footer'
import axios from 'axios'

const HomePage = () => {
  const [allCards, setAllCards] = useState([])
  const [priceSort, setPriceSort] = useState('')
  const [selectedRating, setSelectedRating] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = e => {
    e.preventDefault()
    
  }

  const handleRatingChange = event => {
    setSelectedRating(event.target.value)
  }

  console.log('searchTerm', searchTerm)

  const fetchData = async (page) => {
    const response = await axios.get(
      `http://localhost:4000/cards?sort=${priceSort}&keyword=${searchTerm}&rating=${selectedRating}&page=${page}&limit=12`,
      { withCredentials: true }
    )
    setAllCards(response.data.updatedCards)
    setTotalPages(response.data.totalPages);
    setCurrentPage(page);
  }

  useEffect(() => {
    fetchData(1)
  }, [priceSort, searchTerm, selectedRating])

  const handlePageChange = (page) => fetchData(page);

  return (
    <>
      <Navbar
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Hero />
      <Filters
        priceSort={priceSort}
        setPriceSort={setPriceSort}
        selectedRating={selectedRating}
        handleRatingChange={handleRatingChange}
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
