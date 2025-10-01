import React, { useState } from 'react'
import '../../App.css'
import image4 from '../../assets/go.png'
import image5 from '../../assets/gi.png'
import image6 from '../../assets/f.png'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = ({ setToggle }) => {
  const navigate = useNavigate();
  const [type, setType] = useState('password')
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
  function handleClick () {
    setToggle()
  }

  const handleError = (err) =>
    toast.error(err, {
      position: "top-right",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-right",
    });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        // .min(6, 'Password must be at least 8 characters')
        // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        // .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        // .matches(/\d/, 'Password must contain at least one number')
        // .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
        .required('Password is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/login",
            values,
          { withCredentials: true }
        );
        console.log(data);
        const { success, message } = data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          handleError(message);
        }
      } catch (error) {
        console.log(error);
      }
      resetForm();
    }
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <h1 className='h1C text-center'>Login</h1>

        <div className='mb-3 mt-3'>
          <label for='exampleInputEmail1' className='form-label labelC'>
            Email address
          </label>
          <input
            id='email'
            name='email'
            className='form-control input1 form-control-sm'
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
        <div className='mb-3'>
          <label for='exampleInputPassword1' className='form-label labelC'>
            Password
          </label>
          <div className='wrapper d-flex justify-content-end align-items-center'>
            <span className='icon me-2 mb-1'>
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
        <div className='d-grid gap-2 buttonDiv'>
          <button className='btn buttonColor btn-sm mb-4' type='Submit'>
            Submit
          </button>
        </div>
        <p className='textP text-center labelC'>
          Don't have an account?{' '}
          <span
          className='cursor'
            style={{ color: '#4b4b9b', textDecoration: 'underline' }}
            onClick={handleClick}
          >
            Sign up
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
      <ToastContainer/>
    </>
  )
}

export default React.memo(Login)
