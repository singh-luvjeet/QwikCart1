import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartContext } from '../context/Cart';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate()
  const { currentUser, loadingUser } = useContext(CartContext)
  
    useEffect(() => {
      if (!loadingUser && currentUser === null) {
        navigate('/login')
      }
    }, [currentUser, loadingUser, navigate])

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      brand: '',
      category: '',
      subCategory: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required').positive('Price must be positive'),
      brand: Yup.string().required('Brand is required'),
      category: Yup.string().required('Category is required'),
      subCategory: Yup.string().required('Sub Category is required')
    }).required("Required"),

    onSubmit: async (values, { resetForm }) => {
      try {

        if (selectedFiles.length === 0) {
          toast.error('Please upload at least one image', { position: 'top-right' });
          return;
        }

        //FormData is a built-in browser API for sending form data, especially files.
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('brand', values.brand);
        formData.append('category', values.category);
        formData.append('subCategory', values.subCategory);

        selectedFiles.forEach(file => formData.append('images', file));

        const { data } = await axios.post(
          'http://localhost:4000/cards/add-card',
          formData,
          { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
        );
        //Data → formData contains the product info + image.
        //Headers → Content-Type: multipart/form-data tells the server that this request contains files.
        //withCredentials: true → sends cookies along with the request (for sessions or authentication).

        toast.success(data.message || 'Product added successfully', { position: 'top-right' });
        resetForm();
        setImagePreviews([]);
        setSelectedFiles([]);

        navigate('/');
        
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong', { position: 'top-right' });
      }
    },
  });

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    // Update selected files
    setSelectedFiles(prev => [...prev, ...files]);
    // Update previews
    const previews = files.map(file => URL.createObjectURL(file));
    //URL.createObjectURL(file) -> Creates a temporary preview URL for a file.
    //When a user selects a file using an <input type="file">, that file only exists locally on their computer — it’s not uploaded to your website yet.If you want to show a preview (for example, display an image thumbnail before uploading it), you need a way for the browser to access that local file.
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const handleRemoveImage = index => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    //We write _ because we don’t care about the element itself, we only care about its index.
  };


  return (
    <div className="container" style={{ marginTop: "80px" }}>
      <h2 className="text-center mb-4">Add New Product</h2>
  
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
            name="images"
            accept="image/*"
            multiple
            className="form-control"
            onChange={handleImageChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.images && formik.errors.images && (
            <small className="text-danger">{formik.errors.images}</small>
          )}
  
          <div className="d-flex flex-wrap mt-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="position-relative me-2 mb-2">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={{ width: "100px", height: "100px", borderRadius: "8px" }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "#255F38",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 addProductBtn">
          Add Product
        </button>
      </form>
    </div>
  );
  
};

export default AddProduct;
