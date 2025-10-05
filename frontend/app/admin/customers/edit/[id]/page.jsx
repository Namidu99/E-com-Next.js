'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditCustomer() {
  const router = useRouter();
  const params = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    contact: '',
    active: true,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    
    if (!token) {
      router.push('/customer/login');
      return;
    }

    fetchCustomer();
  }, [params.id]);

  const fetchCustomer = async () => {
    const token = localStorage.getItem('customer_token');
    
    try {
      // In a real app, this would fetch from API
      // For demo, we'll use local storage
      const customerData = localStorage.getItem('customer_data');
      if (customerData) {
        const data = JSON.parse(customerData);
        if (data.id == params.id) {
          setCustomer(data);
          setFormData({
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            contact: data.contact,
            active: data.active,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccessMessage('');

    const token = localStorage.getItem('customer_token');

    try {
      // Simulate API call
      setTimeout(() => {
        const updatedCustomer = {
          ...customer,
          ...formData,
        };

        setCustomer(updatedCustomer);
        localStorage.setItem('customer_data', JSON.stringify(updatedCustomer));
        setSuccessMessage('Customer updated successfully!');
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating customer:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customer not found</h2>
          <Link href="/customer" className="text-blue-600 hover:text-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/customer/profile"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Customer
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Customer Information
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Update customer details below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer ID - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer ID
              </label>
              <input
                type="text"
                value={`#${customer.id}`}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
              />
            </div>

            {/* First Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.fname && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fname}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.lname && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lname}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {errors.contact && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contact}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <input
                type="checkbox"
                name="active"
                id="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="active" className="flex-1">
                <span className="font-medium text-gray-900 dark:text-white">Active Status</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enable or disable this customer account
                </p>
              </label>
            </div>

            {/* Account Details - Read Only */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {customer.updated_at ? new Date(customer.updated_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <Link
                href="/customer/profile"
                className="flex-1 text-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Danger Zone
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
              <div>
                <p className="font-medium text-red-900 dark:text-red-400">Delete Customer Account</p>
                <p className="text-sm text-red-700 dark:text-red-500">
                  Permanently delete this customer account and all associated data
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this customer account? This action cannot be undone.')) {
                    // Handle delete
                    alert('Delete functionality would be implemented here');
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}