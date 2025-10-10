import React, { useState } from 'react'

const Pagination = ({ onClick, current }) => {
  const totalPages = 17
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
    if (current < totalPages) {
      onClick(current + 1)
    }
  }

  const handlePrevious = () => {
    if (start > 1) {
      setStart(prev => prev - 1)
    }
    if (current > 1) {
      onClick(current - 1)
    }
  }

  const pages = getPages()

  return (
    <div
      className='container d-flex justify-content-center align-items-center'
      style={{ marginTop: '40px', marginBottom: '70px' }}
    >
      <div
        className='PaginationDiv text-center'
        onClick={handlePrevious}
        style={{
          cursor: start > 1 ? 'pointer' : 'not-allowed'
        }}
      >
        <p className='paginationP'>
          <i className='fa fa-angle-left' aria-hidden='true'></i>
        </p>
      </div>

      {pages.map(i => (
        <div
          key={i}
          onClick={() => onClick(i)}
          className={`d-flex justify-content-center align-items-center ${
            current === i ? 'paginationSelected' : 'PaginationDiv'
          }`}
        >
          <p className='paginationP'>{i}</p>
        </div>
      ))}

      <div
        className='PaginationDiv text-center'
        onClick={handleNext}
        style={{
          cursor: start + visibleCount <= totalPages ? 'pointer' : 'not-allowed'
        }}
      >
        <p className='paginationP'>
          <i className='fa fa-angle-right' aria-hidden='true'></i>
        </p>
      </div>
    </div>
  )
}

export default Pagination
