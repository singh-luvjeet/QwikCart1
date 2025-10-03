import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required').positive('Price must be positive'),
      image: Yup.mixed().required('Image is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('image', values.image);

        const { data } = await axios.post(
          'http://localhost:4000/cards/add-card',
          formData,
          { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
        );

        toast.success(data.message || 'Product added successfully', { position: 'top-right' });
        resetForm();
        setImagePreview(null);
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong', { position: 'top-right' });
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue('image', file);//sets the image file into Formik’s form state under the key "image"
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

// FileReader is used to convert the image file into a base64-encoded string.
// This lets you show a preview of the image before it's uploaded.
// setImagePreview() sets the preview image data into state.

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Product</h2>
      <form onSubmit={formik.handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Product Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} // marks field as touched. If there’s a validation error, it can show it.
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <small className="text-danger">{formik.errors.name}</small>
          )}
        </div>

        {/* Description */}
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

        {/* Price */}
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

        {/* Image */}
        <div className="mb-3">
          <input
            type="file"
            name="image"
            accept="image/*" //Restricts the file picker to images only.
            className="form-control"
            onChange={handleImageChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.image && formik.errors.image && (
            <small className="text-danger">{formik.errors.image}</small>
          )}
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2" style={{ width: '100px' }} />
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Product
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
