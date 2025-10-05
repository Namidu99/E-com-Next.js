'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../api/axios';

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('customer_token');
    if (!token) {
      router.push('/customer/login');
      return;
    }

    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${params.id}`);
      console.log(response.data);
      const productData = response.data.data || response.data.product || response.data;
      setProduct(productData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity }];
    }

    setCart(updatedCart);
    localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
    alert('Product added to cart!');
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
          <Link href="/customer/products" className="text-blue-600 hover:text-blue-700">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link 
                href="/customer/products"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Product Details
              </h1>
            </div>

            <Link 
              href="/customer/cart"
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700">
              {product.image ? (
                <img
                  src={`http://localhost:8000/storage/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{product.rating} out of 5</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-3">
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${product.sell_price}
                  </p>
                  {product.cost_price && (
                    <p className="text-xl text-gray-500 line-through">
                      ${product.cost_price}
                    </p>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Availability: {' '}
                  <span className={`font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
                  </span>
                </p>
              </div>

              {/* Quantity Selector */}
              {product.quantity > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-20 px-4 py-2 text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={addToCart}
                disabled={product.quantity === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <Link
                href="/customer/cart"
                className="block w-full text-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                View Cart
              </Link>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Product Details
              </h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Brand:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.brand}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Product ID:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">#{product.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Rating:</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{product.rating}/5</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}