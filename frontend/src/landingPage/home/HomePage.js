import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import Hero from './Hero'
import Card from './Card'
import Filters from './Filters'
import Footer from '../Footer'
import Pagination from './pagination'
import axios from 'axios'

const HomePage = () => {
  const [allCards, setAllCards] = useState([])
  const [priceSort, setPriceSort] = useState('')
  const [selectedRating, setSelectedRating] = useState('all')

  const handleRatingChange = event => {
    setSelectedRating(event.target.value)
  }

  const fetchData = async () => {
    const response = await axios.get(
      `http://localhost:4000/cards?sort=${priceSort}`,
      { withCredentials: true }
    )
    setAllCards(response.data)
  }

  useEffect(() => {
    fetchData()
  }, [priceSort])

  return (
    <>
      <Navbar />
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
      />
      <Footer />
    </>
  )
}

export default HomePage
