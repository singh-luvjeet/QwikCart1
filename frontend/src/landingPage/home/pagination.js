import React from 'react'

const Pagination = () => {
  return (
    <>
      <div
        className='container d-flex justify-content-center align-items-center'
        style={{ marginTop: '40px', marginBottom: '70px' }}
      >
        <div className='PaginationDiv text-center'>
          <p className='paginationP'>1</p>
        </div>
        <div className='PaginationDiv text-center'>
          <p className='paginationP'>2</p>
        </div>
        <div className='PaginationDiv text-center'>
          <p className='paginationP'>3</p>
        </div>
        <div className='PaginationDiv text-center'>
          <p className='paginationP'>
            <i class='fa fa-angle-right' aria-hidden='true'></i>
          </p>
        </div>
      </div>
    </>
  )
}

export default Pagination
