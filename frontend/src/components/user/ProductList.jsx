// src/components/user/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { api } from '../../utils/api';

export default function ProductList({ token, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [searchTerm, selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let url = '/products/?';
      if (searchTerm) url += `search=${searchTerm}&`;
      if (selectedCategory) url += `category=${selectedCategory}&`;
      const data = await api.get(url, token);
      setProducts(data.results || data);
    } catch (err) {
      console.error('Failed to load products');
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const data = await api.get('/categories/', token);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategories([]);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await onAddToCart(productId);
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add product to cart');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Browse Products</h1>

      <div className="bg-white rounded-xl shadow-md p-4 mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <img
                src={product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className="text-xs text-indigo-600 font-semibold uppercase">{product.category_name}</span>
                <h3 className="text-lg font-bold mt-2 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">₹{product.price}</p>
                    <p className="text-sm text-gray-500">{product.stock} in stock</p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}