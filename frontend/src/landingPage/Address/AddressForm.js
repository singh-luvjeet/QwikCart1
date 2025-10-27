import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'

const AddressForm = ({ onClose, onSuccess, editAddress, addresses }) => {
  //destructuring props

  const formik = useFormik({
    initialValues: {
      fullname: editAddress?.fullname || '',
      phone: editAddress?.phone || '',
      street: editAddress?.street || '',
      city: editAddress?.city || '',
      state: editAddress?.state || '',
      postalCode: editAddress?.postalCode || '',
      country: editAddress?.country || '',
      isDefault: editAddress?.isDefault || false
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required('Required'),
      phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone must be 10 digits')
        .required('Required'),
      street: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      postalCode: Yup.string().required('Required'),
      country: Yup.string().required('Required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editAddress) {
          await axios.put(
            `http://localhost:4000/address/${editAddress._id}`,
            values,
            { withCredentials: true }
          )
          toast.success('Address updated successfully!')
        } else {
          const res = await axios.post('http://localhost:4000/address', values, {
            withCredentials: true
          })
          console.log('res', res)

          toast.success('Address added successfully!')
        }
        resetForm()
        onSuccess() 
        onClose() // close modal
      } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong')
      }
    }
  })

  return (
    <div className='modalBackdrop'>
      <div className='modalContent'>
        <h3 className='fw-semibold mb-4'>
          {editAddress ? 'Edit Address' : 'Add Address'}
        </h3>
        <form onSubmit={formik.handleSubmit}>
          <div className='row d-flex'>
            {[
              'fullname',
              'phone',
              'street',
              'city',
              'state',
              'postalCode',
              'country'
            ].map(field => (
              <div key={field} className='col-md-6 form-floating mb-3'>
                <input
                  name={field}
                  type='text'
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='form-control'
                />
                <label htmlFor={field} className='mx-2'>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {formik.touched[field] && formik.errors[field] && (
                  <div className='errorMsg'>{formik.errors[field]}</div>
                )}
              </div>
            ))}
            {(editAddress?.isDefault === false) && <div className='mb-3 form-check'>
              <input
                type='checkbox'
                name='isDefault'
                className='form-check-input'
                checked={formik.values.isDefault}
                onChange={formik.handleChange}
                style={{ boxShadow: 'none' }}
              />
              <label className='form-check-label'>Set as Default</label>
            </div>}
            <div className='d-flex justify-content-start'>
              <button
                type='button'
                className='btn viewBtn me-2'
                style={{
                  width: '120px',
                  backgroundColor: '#dddddd',
                  color: 'black'
                }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='btn viewBtn'
                style={{ width: '120px' }}
              >
                {editAddress ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </form>
        <ToastContainer position='bottom-right' />
      </div>
    </div>
  )
}

export default AddressForm
