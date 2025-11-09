// src/components/user/CartPage.jsx
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { api } from '../../utils/api';
import CheckoutPage from './CheckoutPage';

export default function CartPage({ cart, token, onLoadCart, setCurrentPage }) {
  const [showCheckout, setShowCheckout] = useState(false);

  const updateQuantity = async (itemId, quantity) => {
    await api.put(`/cart/${itemId}/`, { quantity }, token);
    onLoadCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/${itemId}/`, token);
    onLoadCart();
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

  if (showCheckout) {
    return <CheckoutPage cart={cart} total={total} token={token} onBack={() => setShowCheckout(false)} setCurrentPage={setCurrentPage} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg">Your cart is empty</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-4 flex items-center gap-4 shadow">
                <img
                  src={item.product_image || 'https://via.placeholder.com/100'}
                  alt={item.product_name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product_name}</h3>
                  <p className="text-gray-600">₹{item.product_price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{item.total_price}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-3xl font-bold text-indigo-600">₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}