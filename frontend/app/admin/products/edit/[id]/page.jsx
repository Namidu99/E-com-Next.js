'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../api/axios';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    name: '',
    quantity: '',
    cost_price: '',
    sell_price: '',
    description: '',
    rating: '5'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/admin/products/${params.id}`);
      const product = response.data.product || response.data;
      
      setFormData({
        brand: product.brand || '',
        name: product.name || '',
        quantity: product.quantity || '',
        cost_price: product.cost_price || '',
        sell_price: product.sell_price || '',
        description: product.description || '',
        rating: product.rating || '5'
      });
      setCurrentImage(product.image);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
      router.push('/admin/products');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.quantity || formData.quantity < 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.cost_price || formData.cost_price < 0) newErrors.cost_price = 'Valid cost price is required';
    if (!formData.sell_price || formData.sell_price < 0) newErrors.sell_price = 'Valid sell price is required';
    if (parseFloat(formData.sell_price) < parseFloat(formData.cost_price)) {
      newErrors.sell_price = 'Sell price must be greater than or equal to cost price';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('brand', formData.brand);
      data.append('name', formData.name);
      data.append('quantity', formData.quantity);
      data.append('cost_price', formData.cost_price);
      data.append('sell_price', formData.sell_price);
      data.append('description', formData.description);
      data.append('rating', formData.rating);
      data.append('_method', 'PUT');
      
      if (image) {
        data.append('image', image);
      }

      await api.post(`/admin/products/${params.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Product updated successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Failed to update product. Please try again.');
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Product
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update the product details below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.brand ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter brand name"
              />
              {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand}</p>}
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter quantity"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
            </div>

            {/* Cost Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cost Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="cost_price"
                value={formData.cost_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.cost_price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter cost price"
              />
              {errors.cost_price && <p className="mt-1 text-sm text-red-500">{errors.cost_price}</p>}
            </div>

            {/* Sell Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sell Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="sell_price"
                value={formData.sell_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.sell_price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter sell price"
              />
              {errors.sell_price && <p className="mt-1 text-sm text-red-500">{errors.sell_price}</p>}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.rating ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
              {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter product description"
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Image
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                Change Image
              </label>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg"
                />
              ) : currentImage ? (
                <img
                  src={`http://localhost:8000/storage/${currentImage}`}
                  alt="Current"
                  className="h-20 w-20 object-cover rounded-lg"
                />
              ) : null}
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Maximum file size: 5MB. Supported formats: JPG, PNG, GIF. Leave empty to keep current image.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating Product...' : 'Update Product'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}