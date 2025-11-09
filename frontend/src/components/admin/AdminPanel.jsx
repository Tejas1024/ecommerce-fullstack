// src/components/admin/AdminPanel.jsx
import React from 'react';
import { ShoppingCart, User, LogOut, TrendingUp, Package } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

export default function AdminPanel({ user, token, onLogout, currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} onLogout={onLogout} setCurrentPage={setCurrentPage} />
      <div className="flex">
        <AdminSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="flex-1 p-8">
          {currentPage === 'admin-dashboard' && <AdminDashboard token={token} />}
          {currentPage === 'admin-products' && <AdminProducts token={token} />}
          {currentPage === 'admin-orders' && <AdminOrders token={token} />}
        </main>
      </div>
    </div>
  );
}

function AdminHeader({ user, onLogout, setCurrentPage }) {
  return (
    <header className="bg-indigo-700 text-white shadow-lg">
      <div className="px-8 py-4 flex justify-between items-center">
        <button onClick={() => setCurrentPage('admin-dashboard')} className="flex items-center gap-2">
          <ShoppingCart className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">E-Commerce Admin</h1>
            <p className="text-sm text-indigo-200">Management Panel</p>
          </div>
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span>{user.username}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminSidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'admin-products', label: 'Products', icon: Package },
    { id: 'admin-orders', label: 'Orders', icon: ShoppingCart }
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === item.id
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}