// src/components/admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { Download, Eye } from 'lucide-react';
import { api, API_BASE_URL } from '../../utils/api';
import OrderDetail from './OrderDetail';

export default function AdminOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchTerm]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      let url = '/admin/orders/?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (searchTerm) url += `search=${searchTerm}&`;
      const data = await api.get(url, token);
      setOrders(data.results || data);
    } catch (err) {
      console.error('Failed to load orders');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/update_status/`, { status: newStatus }, token);
      loadOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/export_csv/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order_ids: selectedOrders })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) {
      alert('Failed to export CSV');
    }
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

  if (viewOrder) {
    return <OrderDetail order={viewOrder} token={token} onBack={() => setViewOrder(null)} onStatusUpdate={handleStatusUpdate} onRefresh={loadOrders} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by Order ID or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleExportCSV}
          disabled={selectedOrders.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(orders.map(o => o.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order.id]);
                        } else {
                          setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{order.order_id}</td>
                  <td className="px-6 py-4">{order.user_email}</td>
                  <td className="px-6 py-4">₹{order.total_amount}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)} border-0`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setViewOrder(order)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}