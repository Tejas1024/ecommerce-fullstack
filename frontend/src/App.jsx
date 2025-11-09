import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Search, Package, Plus, Edit, Trash2, Eye, Download, TrendingUp } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

const api = {
  get: async (endpoint, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!res.ok) throw new Error('API request failed');
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
    if (!res.ok) throw new Error('API request failed');
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
    if (!res.ok) throw new Error('API request failed');
    return res.json();
  },
  delete: async (endpoint, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE', headers });
    if (!res.ok) throw new Error('API request failed');
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const result = await onLogin(formData.username, formData.password, isAdmin);
        if (result.error) setError(result.error);
      } else {
        if (formData.password !== formData.password2) {
          setError("Passwords don't match");
          setLoading(false);
          return;
        }
        const result = await onRegister(formData);
        if (result.error) setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
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
          <button onClick={() => { setIsLogin(true); setIsAdmin(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${!isAdmin && isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            User Login
          </button>
          <button onClick={() => { setIsLogin(true); setIsAdmin(true); setError(''); }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${isAdmin && isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Admin Login
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />

          {!isLogin && (
            <>
              <input type="email" placeholder="Email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                <input type="text" placeholder="Last Name" value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <input type="tel" placeholder="Phone" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </>
          )}

          <input type="password" placeholder="Password" value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />

          {!isLogin && (
            <input type="password" placeholder="Confirm Password" value={formData.password2}
              onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          )}

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400">
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {!isAdmin && (
          <p className="text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-indigo-600 font-medium hover:underline">
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
              className={`font-medium transition ${currentPage === 'home' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
              Products
            </button>
            <button onClick={() => setCurrentPage('orders')}
              className={`font-medium transition ${currentPage === 'orders' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
              My Orders
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentPage('cart')} className="relative p-2 hover:bg-gray-100 rounded-lg transition">
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
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
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
      console.error('Failed to load products:', err);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const data = await api.get('/categories/', token);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            <option value="">All Categories</option>
            {Array.isArray(categories) && categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
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
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
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
  const [updating, setUpdating] = useState(false);

  const updateQuantity = async (itemId, quantity) => {
    setUpdating(true);
    try {
      await api.put(`/cart/${itemId}/`, { quantity }, token);
      await onLoadCart();
    } catch (err) {
      alert('Failed to update quantity');
    }
    setUpdating(false);
  };

  const removeItem = async (itemId) => {
    if (confirm('Remove this item from cart?')) {
      try {
        await api.delete(`/cart/${itemId}/`, token);
        await onLoadCart();
      } catch (err) {
        alert('Failed to remove item');
      }
    }
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

  if (showCheckout) {
    return <CheckoutPage cart={cart} total={total} token={token} onBack={() => setShowCheckout(false)} setCurrentPage={setCurrentPage} onLoadCart={onLoadCart} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <button onClick={() => setCurrentPage('home')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
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
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} disabled={updating}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition">-</button>
                  <span className="px-4 font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={updating}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition">+</button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{item.total_price}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-sm transition">
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
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium transition">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Checkout Page Component
function CheckoutPage({ cart, total, token, onBack, setCurrentPage, onLoadCart }) {
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
        await onLoadCart(); // Clear cart
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" rows="3" required />

        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="City" value={formData.shipping_city}
            onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          <input type="text" placeholder="State" value={formData.shipping_state}
            onChange={(e) => setFormData({ ...formData, shipping_state: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Pincode" value={formData.shipping_pincode}
            onChange={(e) => setFormData({ ...formData, shipping_pincode: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          <input type="tel" placeholder="Phone Number" value={formData.shipping_phone}
            onChange={(e) => setFormData({ ...formData, shipping_phone: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium disabled:bg-indigo-400 transition">
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
      console.error('Failed to load orders:', err);
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
        <div className="text-center py-12 bg-white rounded-lg shadow">
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

// Admin Dashboard Component
function AdminDashboard({ token }) {
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
      console.error('Failed to load stats:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Pending Orders', value: stats?.pending_orders || 0, icon: Package, color: 'bg-yellow-500' },
    { label: 'Total Revenue', value: `₹${(stats?.total_revenue || 0).toFixed(2)}`, icon: TrendingUp, color: 'bg-green-500' },
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

// Product Form Component
function ProductForm({ token, categories, product, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category: product?.category || '',
    description: product?.description || '',
    price: product?.price || '',
    weight: product?.weight || '',
    stock: product?.stock || '',
    image: product?.image || '',
    is_active: product?.is_active !== undefined ? product.is_active : true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (product) {
        await api.put(`/admin/products/${product.id}/`, formData, token);
        alert('Product updated successfully!');
      } else {
        await api.post('/admin/products/', formData, token);
        alert('Product created successfully!');
      }
      onRefresh();
      onClose();
    } catch (err) {
      setError('Failed to save product. Please check all fields.');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h1>
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
          Cancel
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input type="text" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
            <input type="text" value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required>
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" rows="4" required />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
            <input type="number" step="0.01" value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
            <input type="number" step="0.01" value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
            <input type="number" value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input type="url" value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="https://example.com/image.jpg" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_active" checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Product is Active
          </label>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium disabled:bg-indigo-400 transition">
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

// Admin Products Component
function AdminProducts({ token }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [searchTerm]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let url = '/admin/products/';
      if (searchTerm) url += `?search=${searchTerm}`;
      const data = await api.get(url, token);
      setProducts(data.results || data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const data = await api.get('/categories/', token);
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}/`, token);
        alert('Product deleted successfully!');
        loadProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditProduct(null);
  };

  if (showForm) {
    return <ProductForm token={token} categories={categories} product={editProduct} onClose={handleFormClose} onRefresh={loadProducts} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="mb-6">
        <input type="text" placeholder="Search products..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <img src={product.image || 'https://via.placeholder.com/50'} alt={product.name}
                        className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4">{product.category_name}</td>
                    <td className="px-6 py-4">₹{product.price}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Order Detail Component
function OrderDetail({ order, token, onBack, onRefresh }) {
  const [notes, setNotes] = useState(order.admin_notes || '');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(order.status);

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

  const handleStatusUpdate = async (newStatus) => {
    if (confirm('Are you sure you want to update the order status?')) {
      try {
        await api.put(`/admin/orders/${order.id}/update_status/`, { status: newStatus }, token);
        setStatus(newStatus);
        alert('Status updated successfully');
        onRefresh();
      } catch (err) {
        alert('Failed to update status');
      }
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
            <select value={status} onChange={(e) => handleStatusUpdate(e.target.value)}
              className={`px-4 py-2 rounded-full font-medium ${getStatusColor(status)} border-0 cursor-pointer`}>
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
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows="4" placeholder="Add internal notes about this order..." />
          <button onClick={handleSaveNotes} disabled={saving}
            className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition">
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Admin Orders Component
function AdminOrders({ token }) {
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
      console.error('Failed to load orders:', err);
    }
    setLoading(false);
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
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
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
    return <OrderDetail order={viewOrder} token={token} onBack={() => setViewOrder(null)} onRefresh={loadOrders} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex gap-4">
        <input type="text" placeholder="Search by Order ID or Email..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button onClick={handleExportCSV} disabled={selectedOrders.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(orders.map(o => o.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                      className="w-4 h-4" />
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
                      <input type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders([...selectedOrders, order.id]);
                          } else {
                            setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                          }
                        }}
                        className="w-4 h-4" />
                    </td>
                    <td className="px-6 py-4 font-medium">{order.order_id}</td>
                    <td className="px-6 py-4">{order.user_email}</td>
                    <td className="px-6 py-4">₹{order.total_amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => setViewOrder(order)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Panel Component
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
            <button onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4 space-y-2">
            <button onClick={() => setCurrentPage('admin-dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === 'admin-dashboard'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
              <TrendingUp className="w-5 h-5" />
              Dashboard
            </button>
            <button onClick={() => setCurrentPage('admin-products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === 'admin-products'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
              <Package className="w-5 h-5" />
              Products
            </button>
            <button onClick={() => setCurrentPage('admin-orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentPage === 'admin-orders'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
              <ShoppingCart className="w-5 h-5" />
              Orders
            </button>
          </nav>
        </aside>
        
        <main className="flex-1 p-8">
          {currentPage === 'admin-dashboard' && <AdminDashboard token={token} />}
          {currentPage === 'admin-products' && <AdminProducts token={token} />}
          {currentPage === 'admin-orders' && <AdminOrders token={token} />}
        </main>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);

          if (userData.role !== 'admin') {
            await loadCart(storedToken);
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const loadCart = async (authToken = token) => {
    try {
      const data = await api.get('/cart/', authToken);
      setCart(data.results || data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  const login = async (username, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? '/admin/login/' : '/auth/login/';
      const data = await api.post(endpoint, { username, password });
      if (data.tokens) {
        setToken(data.tokens.access);
        setUser(data.user);
        localStorage.setItem('token', data.tokens.access);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentPage(data.user.role === 'admin' ? 'admin-dashboard' : 'home');
        if (data.user.role !== 'admin') loadCart(data.tokens.access);
        return data;
      }
      return { error: data.error || 'Login failed' };
    } catch (err) {
      return { error: 'Invalid credentials' };
    }
  };

  const register = async (formData) => {
    try {
      const data = await api.post('/auth/register/', formData);
      if (data.tokens) {
        setToken(data.tokens.access);
        setUser(data.user);
        localStorage.setItem('token', data.tokens.access);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentPage('home');
        loadCart(data.tokens.access);
        return data;
      }
      return { error: data.error || 'Registration failed' };
    } catch (err) {
      return { error: 'Registration failed' };
    }
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
    try {
      await api.post('/cart/', { product: productId, quantity }, token);
      await loadCart();
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

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