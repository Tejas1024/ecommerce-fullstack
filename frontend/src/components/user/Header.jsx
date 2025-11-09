// src/components/user/Header.jsx
import React from 'react';
import { ShoppingCart, User, LogOut } from 'lucide-react';

export default function Header({ user, cartCount, onLogout, currentPage, setCurrentPage }) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800">E-Shop</span>
          </button>
          <nav className="flex gap-6">
            <button
              onClick={() => setCurrentPage('home')}
              className={`font-medium ${currentPage === 'home' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Products
            </button>
            <button
              onClick={() => setCurrentPage('orders')}
              className={`font-medium ${currentPage === 'orders' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              My Orders
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage('cart')}
            className="relative p-2 hover:bg-gray-100 rounded-lg"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">{user.username}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}