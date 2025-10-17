import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from 'react-icons/fa'
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import '../../App.css'

const ChangePassword = () => {
    const [type, setType] = useState('password')
    const [icon, setIcon] = useState(FaEyeSlash)
    const [type2, setType2] = useState('password')
    const [type3, setType3] = useState('password')

    const handleToggle2 = () => {
        if (type2 === 'password') {
          setIcon(FaEye)
          setType2('text')
        } else {
          setIcon(FaEyeSlash)
          setType2('password')
        }
      }

      const handleToggle3 = () => {
          if (type3 === 'password') {
            setIcon(FaEye)
            setType3('text')
          } else {
            setIcon(FaEyeSlash)
            setType3('password')
          }
        }

    const handleToggle = () => {
        if (type === 'password') {
          setIcon(FaEye)
          setType('text')
        } else {
          setIcon(FaEyeSlash)
          setType('password')
        }
      }

    const formik = useFormik({
        initialValues: {
          oldPassword: "",
          newPassword : "",
          confirmPassword: "",
        },
        validationSchema: Yup.object({
          oldPassword: Yup.string()
            .required('Password is required'),
        newPassword: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/\d/, 'Password must contain at least one number')
            .matches(
                /[!@#$%^&*]/,
                'Password must contain at least one special character'
            )
            .required('New Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm password is required')
        }),
        onSubmit: async (values, { resetForm }) => {
          try {
            const { data } = await axios.post(
              "http://localhost:4000/change-password",
                {
                  oldPassword:values.oldPassword,
                  newPassword:values.newPassword
                },
                { withCredentials: true }
            );
            console.log(data);
          } catch (error) {
            console.log(error);
          }
          resetForm();
        }
      })

    return (
    <>
       <form onSubmit={formik.handleSubmit}>
               <h1 className=' text-center'>Change Password</h1>
       
               <div className='mb-3'>
                 <label htmlFor='oldPassword' className='form-label '>
                  Old Password
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
                     id='oldPassword'
                     name='oldPassword'
                     className='form-control inputP form-control-sm'
                    //  placeholder='Enter Password'
                     type={type}
                     onChange={formik.handleChange}
                     onBlur={formik.handleBlur}
                     value={formik.values.oldPassword}
                   />
                 </div>
                 {formik.touched.oldPassword && formik.errors.oldPassword ? (
                   <div className='errorMsg'>{formik.errors.oldPassword}</div>
                 ) : null}
               </div>

               <label for='newPassword' className='form-label'>
                  New Password
                 </label>
               <div className='wrapper d-flex justify-content-end align-items-center'>
                    <span className='icon me-1 mb-1'>
                    {type2 === 'password' ? (
                        <FaEyeSlash onClick={handleToggle2} className='cursor' />
                    ) : (
                        <FaEye onClick={handleToggle2} className='cursor' />
                    )}
                    </span>
                    <input
                    id='newPassword'
                    name='newPassword'
                    className='form-control inputP form-control-sm'
                    // placeholder='Enter Password'
                    type={type2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                    />
                </div>
                {formik.touched.newPassword && formik.errors.newPassword ? (
                    <div className='errorMsg'>{formik.errors.newPassword}</div>
                ) : null}
            
                
            <label for='confirmPassword' className='form-label'>
                  Confirm Password
                 </label>
                <div className='wrapper d-flex justify-content-end align-items-center'>
                    <span className='icon me-1 mb-1'>
                    {type3 === 'password' ? (
                        <FaEyeSlash onClick={handleToggle3} className='cursor' />
                    ) : (
                        <FaEye onClick={handleToggle3} className='cursor' />
                    )}
                    </span>
                    <input
                    id='confirmPassword'
                    name='confirmPassword'
                    className='form-control inputP form-control-sm '
                    // placeholder='Confirm Pass...'
                    type={type3}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    />
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <div className='errorMsg'>{formik.errors.confirmPassword}</div>
                    ) : null}
                
                       
               <div className='d-grid gap-2 buttonDiv'>
                 <button className='btn buttonColor btn-sm mb-4' type='Submit'>
                   Submit
                 </button>
               </div>
    
        </form>
    </>
    )
}

export default ChangePassword;