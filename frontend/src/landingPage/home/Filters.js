import React from 'react'
import Button from '../Button'

const Filters = ({priceSort, setPriceSort, selectedRating, handleRatingChange}) => {

  
  // console.log("priceSort>>", priceSort)

  return (
    <>
      <div className='d-flex justify-content-between align-items-center filterDiv'>
        <div style={{ margin: '50px 0 0 75px' }}>
          {/* <Button class name='Headphone Type' /> */}
          {/* <Button name='Price' /> */}

          <select className='buttonComp mx-4' onChange={(e) => setPriceSort(e.target.value)}>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          {/* <Button name='Review' /> */}

          <select className='buttonComp' id="rating-filter" value={selectedRating} onChange={handleRatingChange}>
            <option value="1">All Ratings</option>
            <option value="2">2 Stars & Up</option>
            <option value="3">3 Stars & Up</option>
            <option value="4">4 Stars & Up</option>
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
