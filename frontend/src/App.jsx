// src/App.jsx
import React, { useState, useEffect } from 'react';
import { api } from './utils/api';
import AuthPage from './components/AuthPage';
import Header from './components/user/Header';
import ProductList from './components/user/ProductList';
import CartPage from './components/user/CartPage';
import OrdersPage from './components/user/OrdersPage';
import AdminPanel from './components/admin/AdminPanel';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      if (userData.role !== 'admin') {
        loadCart();
      }
    }
  }, [token]);

  const loadCart = async () => {
    try {
      const data = await api.get('/cart/', token);
      setCart(data.results || data);
    } catch (err) {
      console.error('Failed to load cart');
    }
  };

  const login = async (username, password, isAdmin = false) => {
    const endpoint = isAdmin ? '/admin/login/' : '/auth/login/';
    const data = await api.post(endpoint, { username, password });
    if (data.tokens) {
      setToken(data.tokens.access);
      setUser(data.user);
      localStorage.setItem('token', data.tokens.access);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentPage(data.user.role === 'admin' ? 'admin-dashboard' : 'home');
      if (data.user.role !== 'admin') loadCart();
    }
    return data;
  };

  const register = async (formData) => {
    const data = await api.post('/auth/register/', formData);
    if (data.tokens) {
      setToken(data.tokens.access);
      setUser(data.user);
      localStorage.setItem('token', data.tokens.access);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentPage('home');
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCart([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('home');
  };

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart/', { product: productId, quantity }, token);
    loadCart();
  };

  if (!user) {
    return <AuthPage onLogin={login} onRegister={register} />;
  }

  if (user.role === 'admin') {
    return (
      <AdminPanel
        user={user}
        token={token}
        onLogout={logout}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        cartCount={cart.length}
        onLogout={logout}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && <ProductList token={token} onAddToCart={addToCart} />}
        {currentPage === 'cart' && <CartPage cart={cart} token={token} onLoadCart={loadCart} setCurrentPage={setCurrentPage} />}
        {currentPage === 'orders' && <OrdersPage token={token} />}
      </main>
    </div>
  );
}