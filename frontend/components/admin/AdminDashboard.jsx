// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, AlertCircle, DollarSign, Package } from 'lucide-react';
import { api } from '../../utils/api';

export default function AdminDashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.get('/admin/dashboard/', token);
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const cards = [
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Pending Orders', value: stats?.pending_orders || 0, icon: AlertCircle, color: 'bg-yellow-500' },
    { label: 'Total Revenue', value: `₹${stats?.total_revenue || 0}`, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Total Products', value: stats?.total_products || 0, icon: Package, color: 'bg-purple-500' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {stats?.recent_orders && stats.recent_orders.length > 0 ? (
          <div className="space-y-3">
            {stats.recent_orders.map(order => (
              <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{order.order_id}</p>
                  <p className="text-sm text-gray-600">{order.user_email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{order.total_amount}</p>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No recent orders</p>
        )}
      </div>
    </div>
  );
}