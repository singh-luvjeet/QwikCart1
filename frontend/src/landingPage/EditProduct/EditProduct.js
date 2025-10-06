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
      name: '',
      description: '',
      price: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required').positive('Price must be positive'),
    }),
    onSubmit: async (values) => {
      try {
        if (images.length === 0) {
          toast.error('Please upload at least one image', { position: 'top-right' });
          return;
        }

        //FormData is a special JavaScript object used to send form data, especially files, via HTTP requests.
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);

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
        const { data } = await axios.get(`http://localhost:4000/cards/${id}`);
        formik.setValues({
          name: data.name || '',
          description: data.description || '',
          price: data.price || '',
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
      <form onSubmit={formik.handleSubmit} className="w-50 mx-auto">

        <div className="mb-3">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Product Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <small className="text-danger">{formik.errors.name}</small>
          )}
        </div>

        <div className="mb-3">
          <textarea
            name="description"
            className="form-control"
            placeholder="Product Description"
            rows="3"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description && (
            <small className="text-danger">{formik.errors.description}</small>
          )}
        </div>

        <div className="mb-3">
          <input
            type="number"
            name="price"
            className="form-control"
            placeholder="$ Price"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
          />
          {formik.touched.price && formik.errors.price && (
            <small className="text-danger">{formik.errors.price}</small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Images</label>
          <input type="file" multiple accept="image/*" className="form-control" onChange={handleImageChange} />
          <div className="d-flex flex-wrap mt-2">
            {images.map((img, index) => {
              const preview = img instanceof File ? URL.createObjectURL(img) : img;
              return (
                <div key={index} className="position-relative me-2 mb-2">
                  <img src={preview} alt={`Image ${index}`} style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: 'absolute', top: '-5px', right: '-5px', display: 'flex', alignItems: 'center',
                      background: '#255F38', color: 'white', border: 'none', borderRadius: '50%',
                      width: '20px', height: '20px', cursor: 'pointer'
                    }}
                  >×</button>
                </div>
              );
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
