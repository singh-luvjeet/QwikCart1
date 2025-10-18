import React, { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const path = 'http://localhost:3000/static'

const EditForm = () => {
  const [userInfo, setUserInfo] = useState([])
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleDivClick = () => {
    fileInputRef.current.click()
  }

  const fetchUser = async () => {
    const res = await axios.get(`http://localhost:4000/user/user-info`, {
      withCredentials: true
    })
    setUserInfo(res.data)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleClick = async e => {
    let file = e.target.files[0]
    // console.log(file, "aaaaaaaaa")
    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const formik = useFormik({
    initialValues: {
      firstName: userInfo?.firstName || '',
      lastName: userInfo?.lastName || '',
      email: userInfo?.email || ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(8, 'Name is too long')
        .min(2, 'Name is too short')
        .matches(
          /^[A-Z][a-z]+$/,
          'First letter must be Capital and Only alphabetic characters allowed'
        ),

      lastName: Yup.string()
        .max(8, 'Name is too long')
        .min(2, 'Name is too short')
        .matches(
          /^[A-Z][a-z]+$/,
          'First letter must be Capital and Only alphabetic characters allowed'
        ),
      email: Yup.string().email('Invalid email address')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        // console.log("zzzzzzzzzzz", selectedFile);
        const formData = new FormData();
        formData.append('profile_image', selectedFile);
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('email', values.email);

        await axios.patch(`http://localhost:4000/user/edit`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data' 
          }
        });
    
        toast.success('User updated successfully!');
        setUserInfo(values);
        resetForm();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong');
      }
    }
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className='m-5 px-5'>
          <h2 className='text-center fw-semibold'>Edit Your Profile</h2>

          <div
            onClick={handleDivClick}
            className='editImage d-flex justify-content-center align-items-center mx-auto mt-4'
          >
            <img
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                borderRadius: '100%',
                objectFit: 'cover',
                cursor:"pointer"
              }}
              src={
                previewUrl
                  ? previewUrl
                  : userInfo.profile_image
                  ? `http://localhost:4000/uploads/${userInfo.profile_image}`
                  : 'https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg' 
              }
              alt="Profile Preview"
            />
          </div>

          <input
            onChange={handleClick}
            ref={fileInputRef}
            type='file'
            name='profile_image'
            accept='image/*'
            className='form-control'
            onBlur={formik.handleBlur}
            style={{ display: 'none' }}
          />
          {formik.touched.image && formik.errors.image && (
            <small className='text-danger'>{formik.errors.image}</small>
          )}

          <div className='mb-3'>
            <label for='firstName' class='form-label'>
              First Name
            </label>
            <input
              id='firstName'
              name='firstName'
              type='text'
              className='form-control'
              onChange={formik.handleChange}
              // placeholder='First Name'
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className='errorMsg'>{formik.errors.firstName}</div>
            ) : null}
          </div>
          <div className='mb-3'>
            <label for='lastName' class='form-label'>
              Last Name
            </label>
            <input
              id='lastName'
              name='lastName'
              type='text'
              className='form-control '
              onChange={formik.handleChange}
              // placeholder='First Name'
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className='errorMsg'>{formik.errors.lastName}</div>
            ) : null}
          </div>

          <div className='mb-3 '>
            <label for='email' class='form-label'>
              Email
            </label>
            <input
              id='email'
              name='email'
              className='form-control'
              // placeholder='Enter Email'
              type='email'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className='errorMsg'>{formik.errors.email}</div>
            ) : null}
          </div>

          <div className='d-grid '>
            <button className='btn buttonColor mb-4' type='Submit'>
              Submit
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  )
}

export default EditForm
