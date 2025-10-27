import React, { useEffect, useState } from 'react'
import Button from '../Button'
import axios from 'axios'

const Filters = ({
  priceSort,
  setPriceSort,
  selectedRating,
  handleRatingChange,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory
}) => {

  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const brandsRes = await axios.get('http://localhost:4000/brands')
        setBrands(brandsRes.data)

        const categoriesRes = await axios.get(
          'http://localhost:4000/categories'
        )
        setCategories(categoriesRes.data)
      } catch (err) {
        console.error('Error fetching filters:', err)
      }
    }

    fetchFilters()
  }, [])

  // console.log("priceSort>>", priceSort)

  return (
    <>
      <div className='d-flex justify-content-between align-items-center filterDiv'>
        <div style={{ margin: '50px 0 0 75px' }}>
          {/* <Button class name='Headphone Type' /> */}
          {/* <Button name='Price' /> */}

          <select
            className='btn btn-sm buttonComp me-4'
            onChange={e => setPriceSort(e.target.value)}
          >
            <option value='asc'>Price: Low to High</option>
            <option value='desc'>Price: High to Low</option>
          </select>

          {/* <Button name='Review' /> */}

          <select
            className='btn btn-sm buttonComp'
            id='rating-filter'
            value={selectedRating}
            onChange={handleRatingChange}
          >
            <option value='1'>All Ratings</option>
            <option value='2'>2 Stars & Up</option>
            <option value='3'>3 Stars & Up</option>
            <option value='4'>4 Stars & Up</option>
          </select>

          <select
            className='btn btn-sm buttonComp mx-4'
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
          >
            <option value=''>All Brands</option>
            {brands.map(b => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            className='btn btn-sm buttonComp'
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value=''>All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* <Button name='Color' />
          <Button name='Material' />
          <Button name='Offer' />
          <button type='button' class='btn buttonComp btn-sm ms-2'>
            All Filters&nbsp;&nbsp;
            <i class='fa fa-angle-double-right' aria-hidden='true'></i>
          </button> */}
        </div>

        {/* <div>
          <button
            type='button'
            style={{ margin: '50px 75px 0 0', border: '0.1px solid black' }}
            class='btn filterButton rounded-pill btn-sm btn-sm ms-2'
          >
            All Filters&nbsp;&nbsp;
            <i class='fa fa-sort-desc' aria-hidden='true'></i>
          </button>
        </div> */}
      </div>
    </>
  )
}

export default Filters
