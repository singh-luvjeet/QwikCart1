import React from 'react'
import Button from '../Button'

const Filters = () => {
  return (
    <>
      <div className='d-flex justify-content-between align-items-center filterDiv'>
        <div style={{ margin: '50px 0 0 75px' }}>
          <Button class name='Headphone Type' />
          <Button name='Price' />
          <Button name='Review' />
          <Button name='Color' />
          <Button name='Material' />
          <Button name='Offer' />
          <button type='button' class='btn buttonComp btn-sm ms-2'>
            All Filters&nbsp;&nbsp;
            <i class='fa fa-angle-double-right' aria-hidden='true'></i>
          </button>
        </div>

        <div>
          <button
            type='button'
            style={{ margin: '50px 75px 0 0', border: '0.1px solid black' }}
            class='btn rounded-pill btn-sm btn-sm ms-2'
          >
            All Filters&nbsp;&nbsp;
            <i class='fa fa-sort-desc' aria-hidden='true'></i>
          </button>
        </div>
      </div>
    </>
  )
}

export default Filters
