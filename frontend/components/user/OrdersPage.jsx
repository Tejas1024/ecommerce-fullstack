// src/components/user/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { api } from '../../utils/api';

export default function OrdersPage({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.get('/orders/', token);
      setOrders(data.results || data);
    } catch (err) {
      console.error('Failed to load orders');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{order.order_id}</h3>
                  <p className="text-gray-600 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span>₹{item.total_price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-indigo-600">₹{order.total_amount}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <h4 className="font-medium mb-2">Shipping Address:</h4>
                <p className="text-sm text-gray-600">
                  {order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}