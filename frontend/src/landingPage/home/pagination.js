import React, { useState } from 'react'

const Pagination = ({onClick, current, allProducts}) => {

  const totalPages = 17;
  let arr = [];
  for(let i=1;i<=totalPages; i++){
    arr[i] = i;
  }


  return (
    <>
      <div
        className='container d-flex justify-content-center align-items-center'
        style={{ marginTop: '40px', marginBottom: '70px' }}
      >
        {arr.map((i)=>(
        <div key={i} onClick={() => onClick(i)} className={`text-center ${current === i? "paginationSelected": "PaginationDiv"}`}>
          <p className='paginationP'>{i}</p>
        </div>
        ))}
        
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
