// src/components/user/CheckoutPage.jsx
import React, { useState } from 'react';
import { api } from '../../utils/api';

export default function CheckoutPage({ cart, total, token, onBack, setCurrentPage }) {
  const [formData, setFormData] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_pincode: '',
    shipping_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/orders/', formData, token);
      if (response.id) {
        alert('Order placed successfully!');
        setCurrentPage('orders');
      } else {
        setError(response.error || 'Failed to place order');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-4 text-indigo-600 hover:underline">← Back to Cart</button>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2 mb-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.product_name} x {item.quantity}</span>
              <span>₹{item.total_price}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span className="text-indigo-600">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        
        <textarea
          placeholder="Street Address"
          value={formData.shipping_address}
          onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows="3"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="City"
            value={formData.shipping_city}
            onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={formData.shipping_state}
            onChange={(e) => setFormData({ ...formData, shipping_state: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Pincode"
            value={formData.shipping_pincode}
            onChange={(e) => setFormData({ ...formData, shipping_pincode: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.shipping_phone}
            onChange={(e) => setFormData({ ...formData, shipping_phone: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium disabled:bg-gray-300"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}