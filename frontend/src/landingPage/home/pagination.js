import React, { useState } from 'react'

const Pagination = ({ totalPages,handlePageChange,currentPage }) => {
  // Array(page).keys() is not an array but an object 
  // const totalPages = [...Array(totalPages).keys()]
  const visibleCount = 3
  const [start, setStart] = useState(1)

  const getPages = () => {
    const pages = []
    for (let i = 0; i < visibleCount && start + i <= totalPages; i++) {
      pages.push(start + i)
    }
    return pages
  }

  const handleNext = () => {
    if (start + visibleCount <= totalPages) {
      setStart(prev => prev + 1)
    }
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const handlePrevious = () => {
    if (start > 1) {
      setStart(prev => prev - 1)
    }
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const pages = getPages()

  return (
    <div
      className='container d-flex justify-content-center align-items-center'
      style={{ marginTop: '40px', marginBottom: '70px' }}
    >
      {/* <div
        className='PaginationDiv text-center'
        onClick={handlePrevious}
        style={{
          cursor: start > 1 ? 'pointer' : 'not-allowed'
        }}
      > */}
        {/* <p className='paginationP'>
          <i className='fa fa-angle-left' aria-hidden='true'></i>
        </p> */}
      {/* </div> */}

      <button
        className='px-4 py-2 border rounded text-center
          bg-success text-white'
        onClick={handlePrevious}
        style={{
          cursor: start > 1 ? 'pointer' : 'not-allowed'
        }}
      >
          <i className='fa fa-angle-left' aria-hidden='true'></i>
      </button>

      <div className="flex gap-2">
        
        {pages.map((index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={`px-4 py-2 border rounded ${
              currentPage === index ? 'bg-success text-white' : ''
            }`}
          >
            {index}
          </button>
        ))}
      </div>

      <button
        className='px-4 py-2 border rounded text-center
          bg-success text-white'
        onClick={handleNext}
        style={{
          cursor: start + visibleCount <= totalPages ? 'pointer' : 'not-allowed'
        }}
      >
          <i className='fa fa-angle-right' aria-hidden='true'></i>
      </button>

      {/* <div
        className='PaginationDiv text-center'
        onClick={handleNext}
        style={{
          cursor: start + visibleCount <= totalPages ? 'pointer' : 'not-allowed'
        }}
      >
        <p className='paginationP'>
          <i className='fa fa-angle-right' aria-hidden='true'></i>
        </p>
      </div> */}
    </div>
  )
}

export default Pagination
