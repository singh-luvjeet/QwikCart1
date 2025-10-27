import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartContext } from '../context/Cart';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const [images, setImages] = useState([]); // unified array for both existing & new images
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, loadingUser } = useContext(CartContext);
  const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      brand: '',
      category: '',
      subCategory: ''
    },
    // validationSchema: Yup.object({
    //   title: Yup.string().required('Title is required'),
    //   description: Yup.string().required('Description is required'),
    //   price: Yup.number().required('Price is required').positive('Price must be positive'),
    //   brand: Yup.string().required('Brand is required'),
    //   category: Yup.string().required('Category is required'),
    //   subCategory: Yup.string().required('Sub Category is required'),
    // }),
    onSubmit: async (values) => {
      try {
        // if (images.length === 0) {
        //   toast.error('Please upload at least one image', { position: 'top-right' });
        //   return;
        // }

        //FormData is a special JavaScript object used to send form data, especially files, via HTTP requests.
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('brand', values.brand);
        formData.append('category', values.category);
        formData.append('subCategory', values.subCategory);

        const newFiles = images.filter(img => img instanceof File);
        //Checks if img is a File object (i.e., something the user just selected via <input type="file">).
        const existingURLs = images.filter(img => typeof img === 'string');
        //This creates an array existingURLs containing URLs of images that already exist and weren’t removed by the user.

        // Append new uploaded files
        newFiles.forEach(file => formData.append('images', file));

        // Append existing images (keep track of images that were not removed)
        formData.append('existingImages', JSON.stringify(existingURLs));


        const { data } = await axios.patch(
          `http://localhost:4000/cards/${id}/edit`,
          formData,
          { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
        );

        toast.success(data.message || 'Product updated successfully', { position: 'top-right' });
        navigate('/');
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong', { position: 'top-right' });
      }
    },
  });

  useEffect(() => {
    if (!loadingUser && currentUser === null) {
      navigate('/login');
    }
  }, [currentUser, loadingUser, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/cards/${id}`, {
          withCredentials: true,
        });
        formik.setValues({
          title: data.card.title || '',
          description: data.card.description || '',
          price: data.card.price || '',
          brand: data.card.brand?.name || '',
          category: data.card.category?.name || '',
          subCategory: data.card.subCategory?.name || ''
        });
        // set images as URLs from server
        setImages(data.images || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch product', { position: 'top-right' });
        navigate('/');
      }
    };

    if (!loadingUser && currentUser) fetchProduct();
  }, [id, currentUser, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) return <div className="text-center mt-5">Loading product...</div>;

  return (
    <div className="container" style={{ marginTop: '80px' }}>
      <h2 className="text-center mb-4">Edit Product</h2>
  
      <form onSubmit={formik.handleSubmit} className="w-75 mx-auto">

        <div className="row">
          <div className="col-md-6 mb-3 form-floating">
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Product Title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            <label className='ms-2' htmlFor="title">Product Title</label>
            {formik.touched.title && formik.errors.title && (
              <small className="text-danger">{formik.errors.title}</small>
            )}
          </div>
  
          <div className="col-md-6 mb-3 form-floating">
            <input
              type="text"
              name="description"
              className="form-control"
              placeholder="Product Description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            <label className='ms-2' htmlFor="description">Product Description</label>
            {formik.touched.description && formik.errors.description && (
              <small className="text-danger">{formik.errors.description}</small>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3 form-floating">
            <input
              type="number"
              name="price"
              className="form-control"
              placeholder="Price"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
            />
            <label className='ms-2' htmlFor="price">Price ($)</label>
            {formik.touched.price && formik.errors.price && (
              <small className="text-danger">{formik.errors.price}</small>
            )}
          </div>
  
          <div className="col-md-6 mb-3 form-floating">
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder="Brand"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.brand}
            />
            <label className='ms-2' htmlFor="brand">Brand</label>
            {formik.touched.brand && formik.errors.brand && (
              <small className="text-danger">{formik.errors.brand}</small>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3 form-floating">
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Category"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.category}
            />
            <label className='ms-2' htmlFor="category">Category</label>
            {formik.touched.category && formik.errors.category && (
              <small className="text-danger">{formik.errors.category}</small>
            )}
          </div>
  
          <div className="col-md-6 mb-3 form-floating">
            <input
              type="text"
              name="subCategory"
              className="form-control"
              placeholder="Subcategory"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.subCategory}
            />
            <label className='ms-2' htmlFor="subCategory">Subcategory</label>
            {formik.touched.subCategory && formik.errors.subCategory && (
              <small className="text-danger">{formik.errors.subCategory}</small>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
          />
  
          <div className="d-flex flex-wrap mt-2">
            {images.map((img, index) => {
              const preview = img instanceof File ? URL.createObjectURL(img) : img
              return (
                <div key={index} className="position-relative me-2 mb-2">
                  <img
                    src={preview}
                    alt={`Image ${index}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#255F38',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
  
        <button type="submit" className="btn btn-primary w-100 addProductBtn">
          Update Product
        </button>
      </form>
  
      <ToastContainer />
    </div>
  );
  
};

export default EditProduct;
