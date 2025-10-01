import React from 'react'

const Button = ({ name }) => {
  return (
    <>
      <button type='button' class='btn-sm btn buttonComp m-2'>
        {name}&nbsp;&nbsp;<i class='fa fa-sort-desc' aria-hidden='true'></i>
      </button>
    </>
  )
}

export default Button
