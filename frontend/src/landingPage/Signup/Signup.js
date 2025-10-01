import React, { useState } from 'react'
import '../../App.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import image4 from '../../assets/go.png'
import image5 from '../../assets/gi.png'
import image6 from '../../assets/f.png'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from 'react-icons/fa'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = ({ setToggle }) => {
  const navigate = useNavigate();
  const [type, setType] = useState('password')
  const [type2, setType2] = useState('password')
  const [icon, setIcon] = useState(FaEyeSlash)

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(FaEye)
      setType('text')
    } else {
      setIcon(FaEyeSlash)
      setType('password')
    }
  }

  const handleToggle2 = () => {
    if (type2 === 'password') {
      setIcon(FaEye)
      setType2('text')
    } else {
      setIcon(FaEyeSlash)
      setType2('password')
    }
  }

  function handleClick () {
    setToggle()
  }

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(8, 'Name is too long')
        .min(2, 'Name is too short')
        .matches(
          /^[A-Z][a-z]+$/,
          'First letter must be Capital and Only alphabetic characters allowed'
        )
        .required('Required'),
      lastName: Yup.string()
        .max(8, 'Name is too long')
        .min(2, 'Name is too short')
        .matches(
          /^[A-Z][a-z]+$/,
          'First letter must be Capital and Only alphabetic characters allowed'
        )
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(
          /[!@#$%^&*]/,
          'Password must contain at least one special character'
        )
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
    }).required('Required'),
    
    onSubmit: async (values, { resetForm }) => {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/signup",
          values,
          { withCredentials: true }
        );
        const { success, message } = data;
        if (success) {
          toast.success(message, { position: "top-right" });
          setTimeout(() => navigate("/"), 1000);
        } else {
          toast.error(message, { position: "top-right" });
        }
      } catch (error) {
        console.log(error);
      }
      resetForm();
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <h2 className='h1C text-center'>Signup</h2>
        <div className='row mt-3 mb-3 d-flex '>
          <div className='col-6'>
            <input
              id='firstName'
              name='firstName'
              type='text'
              className='form-control form-control-sm '
              onChange={formik.handleChange}
              placeholder='First Name'
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className='errorMsg'>{formik.errors.firstName}</div>
            ) : null}
          </div>
          <div className='col-6'>
            <input
              id='lastName'
              name='lastName'
              type='text'
              className='form-control form-control-sm '
              onChange={formik.handleChange}
              placeholder='Last Name'
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className='errorMsg'>{formik.errors.lastName}</div>
            ) : null}
          </div>
        </div>
        <div className='mb-3 '>
          <input
            id='email'
            name='email'
            className='form-control form-control-sm'
            placeholder='Enter Email'
            type='email'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className='errorMsg'>{formik.errors.email}</div>
          ) : null}
        </div>

        <div className='row mb-3 d-flex'>
          <div className='col-6'>
            <div className='wrapper d-flex justify-content-end align-items-center'>
              <span className='icon me-1 mb-1'>
                {type === 'password' ? (
                  <FaEyeSlash onClick={handleToggle} className='cursor' />
                ) : (
                  <FaEye onClick={handleToggle} className='cursor' />
                )}
              </span>
              <input
                id='password'
                name='password'
                className='form-control inputP form-control-sm'
                placeholder='Enter Password'
                type={type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className='errorMsg'>{formik.errors.password}</div>
            ) : null}
          </div>
          <div className='col-6'>
          <div className='wrapper d-flex justify-content-end align-items-center'>
              <span className='icon me-1 mb-1'>
                {type2 === 'password' ? (
                  <FaEyeSlash onClick={handleToggle2} className='cursor' />
                ) : (
                  <FaEye onClick={handleToggle2} className='cursor' />
                )}
              </span>
              <input
                id='confirmPassword'
                name='confirmPassword'
                className='form-control inputP form-control-sm '
                placeholder='Confirm Pass...'
                type={type2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />

            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className='errorMsg'>{formik.errors.confirmPassword}</div>
            ) : null}
          </div>
        </div>

        <div className='d-grid '>
          <button className='btn btn-sm buttonColor mb-4' type='Submit'>
            Submit
          </button>
        </div>
        <p className='textP text-center labelC'>
          Already have an account?{' '}
          <span
          className='cursor'
            style={{ color: '#4b4b9b', textDecoration: 'underline' }}
            onClick={handleClick}
          >
            Login
          </span>
        </p>
        <p className='textP2'>
          <span>OR</span>
        </p>

        <div className='d-flex justify-content-center align-items-center'>
          <img src={image4} className='google ' alt='..' />
          <img src={image5} className='github ' alt='..' />
          <img src={image6} className='facebook' alt='..' />
        </div>
      </form>
      <ToastContainer /> 
    </>
  )
}

export default React.memo(Signup)
