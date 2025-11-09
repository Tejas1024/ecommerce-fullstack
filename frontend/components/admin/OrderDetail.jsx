// src/components/admin/OrderDetail.jsx
import React, { useState } from 'react';
import { api } from '../../utils/api';

export default function OrderDetail({ order, token, onBack, onStatusUpdate, onRefresh }) {
  const [notes, setNotes] = useState(order.admin_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/orders/${order.id}/add_notes/`, { notes }, token);
      alert('Notes saved successfully');
      onRefresh();
    } catch (err) {
      alert('Failed to save notes');
    }
    setSaving(false);
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
    <div>
      <button onClick={onBack} className="mb-6 text-indigo-600 hover:underline flex items-center gap-2">
        ← Back to Orders
      </button>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{order.order_id}</h1>
            <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
            <select
              value={order.status}
              onChange={(e) => {
                if (confirm('Are you sure you want to update the order status?')) {
                  onStatusUpdate(order.id, e.target.value);
                }
              }}
              className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <p className="text-sm text-gray-600">{order.user_email}</p>
            <p className="text-sm text-gray-600">Phone: {order.shipping_phone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-600">{order.shipping_address}</p>
            <p className="text-sm text-gray-600">{order.shipping_city}, {order.shipping_state}</p>
            <p className="text-sm text-gray-600">PIN: {order.shipping_pincode}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.product_name}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">₹{item.price}</td>
                    <td className="px-4 py-3 font-medium">₹{item.total_price}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan="3" className="px-4 py-3 text-right">Total Amount:</td>
                  <td className="px-4 py-3 text-indigo-600 text-lg">₹{order.total_amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Admin Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows="4"
            placeholder="Add internal notes about this order..."
          />
          <button
            onClick={handleSaveNotes}
            disabled={saving}
            className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
          >
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  );
}