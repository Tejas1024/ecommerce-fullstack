import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Search, Package, Plus, Edit, Trash2, Eye, Download, TrendingUp } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

const api = {
  get: async (endpoint, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    return res.json();
  },
  post: async (endpoint, data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return res.json();
  },
  put: async (endpoint, data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    return res.json();
  },
  delete: async (endpoint, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE', headers });
  }
};

// Auth Page Component
function AuthPage({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    username: '', password: '', email: '', first_name: '', last_name: '', phone: '', password2: ''
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
          <p className="text-gray-600 mt-2">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => { setIsLogin(true); setIsAdmin(false); }}
            className={`flex-1 py-2 rounded-lg font-medium ${!isAdmin && isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            User Login
          </button>
          <button onClick={() => { setIsLogin(true); setIsAdmin(true); }}
            className={`flex-1 py-2 rounded-lg font-medium ${isAdmin && isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            Admin Login
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />

          {!isLogin && (
            <>
              <input type="email" placeholder="Email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                <input type="text" placeholder="Last Name" value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <input type="tel" placeholder="Phone" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </>
          )}

          <input type="password" placeholder="Password" value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />

          {!isLogin && (
            <input type="password" placeholder="Confirm Password" value={formData.password2}
              onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
          )}

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {!isAdmin && (
          <p className="text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-medium hover:underline">
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

// User Header Component
function Header({ user, cartCount, onLogout, currentPage, setCurrentPage }) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800">E-Shop</span>
          </button>
          <nav className="flex gap-6">
            <button onClick={() => setCurrentPage('home')}
              className={`font-medium ${currentPage === 'home' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
              Products
            </button>
            <button onClick={() => setCurrentPage('orders')}
              className={`font-medium ${currentPage === 'orders' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
              My Orders
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentPage('cart')} className="relative p-2 hover:bg-gray-100 rounded-lg">
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
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

// Product List Component
function ProductList({ token, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [searchTerm, selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let url = '/products/?';
      if (searchTerm) url += `search=${searchTerm}&`;
      if (selectedCategory) url += `category=${selectedCategory}&`;
      const data = await api.get(url, token);
      setProducts(data.results || data);
    } catch (err) {
      console.error('Failed to load products');
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const data = await api.get('/categories/', token);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await onAddToCart(productId);
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add product to cart');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Browse Products</h1>

      <div className="bg-white rounded-xl shadow-md p-4 mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search products..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <span className="text-xs text-indigo-600 font-semibold uppercase">{product.category_name}</span>
                <h3 className="text-lg font-bold mt-2 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">₹{product.price}</p>
                    <p className="text-sm text-gray-500">{product.stock} in stock</p>
                  </div>
                  <button onClick={() => handleAddToCart(product.id)} disabled={product.stock === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300">
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}

// Cart Page Component
function CartPage({ cart, token, onLoadCart, setCurrentPage }) {
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
          <button onClick={() => setCurrentPage('home')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-4 flex items-center gap-4 shadow">
                <img src={item.product_image || 'https://via.placeholder.com/100'} alt={item.product_name}
                  className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product_name}</h3>
                  <p className="text-gray-600">₹{item.product_price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                  <span className="px-4">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{item.total_price}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-sm">
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
            <button onClick={() => setShowCheckout(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Checkout Page Component
function CheckoutPage({ cart, total, token, onBack, setCurrentPage }) {
  const [formData, setFormData] = useState({
    shipping_address: '', shipping_city: '', shipping_state: '', shipping_pincode: '', shipping_phone: ''
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

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        
        <textarea placeholder="Street Address" value={formData.shipping_address}
          onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" rows="3" required />

        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="City" value={formData.shipping_city}
            onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
          <input type="text" placeholder="State" value={formData.shipping_state}
            onChange={(e) => setFormData({ ...formData, shipping_state: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Pincode" value={formData.shipping_pincode}
            onChange={(e) => setFormData({ ...formData, shipping_pincode: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
          <input type="tel" placeholder="Phone Number" value={formData.shipping_phone}
            onChange={(e) => setFormData({ ...formData, shipping_phone: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium disabled:bg-gray-300">
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

// Orders Page Component
function OrdersPage({ token }) {
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

// Admin Panel (simplified - full version would be separate files)
function AdminPanel({ user, token, onLogout, currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen bg-gray-50">
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
            <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <p className="text-gray-600 mb-4">Welcome to the admin panel!</p>
          <p className="text-sm text-gray-500">Full admin features are available in the complete application.</p>
        </div>
      </div>
    </div>
  );
}

// Main App Component
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
    return <AdminPanel user={user} token={token} onLogout={logout} currentPage={currentPage} setCurrentPage={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} cartCount={cart.length} onLogout={logout} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && <ProductList token={token} onAddToCart={addToCart} />}
        {currentPage === 'cart' && <CartPage cart={cart} token={token} onLoadCart={loadCart} setCurrentPage={setCurrentPage} />}
        {currentPage === 'orders' && <OrdersPage token={token} />}
      </main>
    </div>
  );
}