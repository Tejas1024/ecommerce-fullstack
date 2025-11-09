// src/components/AuthPage.jsx
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function AuthPage({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password2: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const result = await onLogin(formData.username, formData.password, isAdmin);
        if (result.error) setError(result.error);
      } else {
        if (formData.password !== formData.password2) {
          setError("Passwords don't match");
          return;
        }
        const result = await onRegister(formData);
        if (result.error) setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <ShoppingCart className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">E-Commerce Store</h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setIsLogin(true); setIsAdmin(false); }}
            className={`flex-1 py-2 rounded-lg font-medium ${!isAdmin && isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            User Login
          </button>
          <button
            onClick={() => { setIsLogin(true); setIsAdmin(true); }}
            className={`flex-1 py-2 rounded-lg font-medium ${isAdmin && isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Admin Login
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />

          {!isLogin && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {!isAdmin && (
          <p className="text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-medium hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        )}

        {isAdmin && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <p className="font-medium">Test Admin Credentials:</p>
            <p>Username: admin</p>
            <p>Password: Admin@12345</p>
          </div>
        )}
      </div>
    </div>
  );
}