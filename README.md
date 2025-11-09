# 🛒 E-Commerce Full Stack Application

Complete e-commerce platform with user shopping features and comprehensive admin panel for product and order management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Admin Credentials](#admin-credentials)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)

---

## ✨ Features

### User Features
- ✅ User Registration & Login (JWT Authentication)
- ✅ Browse Products with Search & Category Filter
- ✅ Product Detail View
- ✅ Add to Cart & Manage Cart Items
- ✅ Checkout with Shipping Address
- ✅ View Order History
- ✅ Real-time Stock Availability

### Admin Features
- ✅ Secure Admin Login (Role-based)
- ✅ Dashboard with Stats (Total Orders, Revenue, Products, Pending Orders)
- ✅ Complete Product CRUD Operations
- ✅ Search & Filter Products
- ✅ Order Management (View, Update Status)
- ✅ Order Status Updates (Pending → Processing → Shipped → Delivered → Cancelled)
- ✅ Add Internal Admin Notes to Orders
- ✅ Export Orders to CSV
- ✅ Responsive Admin Panel

---

## 🛠 Tech Stack

### Backend
- **Django 4.2.7** - Python web framework
- **Django REST Framework** - API development
- **Django Simple JWT** - JWT authentication
- **SQLite** - Database (easily switchable to PostgreSQL)
- **Django CORS Headers** - CORS handling

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Fetch API** - HTTP requests

---

## 📁 Project Structure

```
ecommerce-fullstack/
├── backend/
│   ├── ecommerce/
│   │   ├── __init__.py
│   │   ├── settings.py          # Django settings
│   │   ├── urls.py               # Main URL configuration
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── models.py             # Database models
│   │   ├── serializers.py        # DRF serializers
│   │   ├── views.py              # API views
│   │   ├── urls.py               # API URLs
│   │   ├── admin.py              # Django admin customization
│   │   └── permissions.py        # Custom permissions
│   ├── manage.py
│   ├── requirements.txt          # Python dependencies
│   ├── seed_data.py              # Database seeding script
│   └── db.sqlite3                # SQLite database (created after setup)
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # Main React component (all-in-one)
    │   └── main.jsx
    ├── index.html
    ├── package.json              # Node dependencies
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/downloads)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository (After Creating It)

```bash
# Create project directory
mkdir ecommerce-fullstack
cd ecommerce-fullstack

# Initialize git
git init
```

### Step 2: Backend Setup

```bash
# Create backend directory
mkdir backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Create requirements.txt file
# (Copy the requirements.txt content from artifacts)

# Install dependencies
pip install -r requirements.txt

# Create Django project structure
django-admin startproject ecommerce .
python manage.py startapp api

# Copy all backend code files from artifacts:
# - ecommerce/settings.py
# - ecommerce/urls.py
# - api/models.py
# - api/serializers.py
# - api/views.py
# - api/urls.py
# - api/admin.py
# - api/permissions.py
# - seed_data.py

# IMPORTANT: Update settings.py AUTH_USER_MODEL
# Add this line to settings.py:
# AUTH_USER_MODEL = 'api.User'

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Seed database with admin and sample products
python seed_data.py

# Create superuser for Django admin (optional)
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

### Step 3: Frontend Setup

```bash
# Open new terminal
cd ../  # Go back to project root

# Create React app with Vite
npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Lucide React (icons)
npm install lucide-react

# Configure Tailwind CSS
# Update tailwind.config.js:
```

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```bash
# Update src/index.css:
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```bash
# Replace src/App.jsx with the complete frontend code from artifacts
# Replace src/main.jsx:
```

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 4: Environment Configuration

#### Backend (.env file - Optional)

Create `backend/.env`:

```env
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

#### Frontend (API URL)

The frontend is already configured to use `http://localhost:8000/api` as the API base URL. If deploying, update the `API_BASE_URL` constant in `App.jsx`.

---

## ▶️ Running the Application

### Start Backend Server

```bash
# In backend directory with virtual environment activated
cd backend
python manage.py runserver

# Server will run at: http://localhost:8000
# Django Admin: http://localhost:8000/admin
```

### Start Frontend Development Server

```bash
# In frontend directory (new terminal)
cd frontend
npm run dev

# Server will run at: http://localhost:5173
```

### Access the Application

- **User Interface**: http://localhost:5173
- **Admin Panel**: http://localhost:5173 (login with admin credentials)
- **Django Admin**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/api/ (browsable API)

---

## 🔑 Admin Credentials

### Test Admin Account (Created by seed_data.py)

```
Username: admin
Password: Admin@12345
```

**⚠️ IMPORTANT**: Change this password in production!

### Django Admin Panel

Use the same credentials or create a new superuser:

```bash
python manage.py createsuperuser
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register/` | User registration |
| POST | `/auth/login/` | User login |
| GET | `/auth/profile/` | Get user profile (protected) |
| POST | `/admin/login/` | Admin login |
| GET | `/admin/profile/` | Get admin profile (protected) |

### Public Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products/` | List all products (with search & filters) |
| GET | `/products/{slug}/` | Get product details |
| GET | `/categories/` | List all categories |

### User Cart Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart/` | Get user's cart items |
| POST | `/cart/` | Add item to cart |
| PUT | `/cart/{id}/` | Update cart item quantity |
| DELETE | `/cart/{id}/` | Remove item from cart |
| DELETE | `/cart/clear/` | Clear entire cart |

### User Order Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders/` | Get user's orders |
| POST | `/orders/` | Create new order |
| GET | `/orders/{id}/` | Get order details |

### Admin Product Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/products/` | List all products (with pagination) |
| POST | `/admin/products/` | Create new product |
| GET | `/admin/products/{id}/` | Get product by ID |
| PUT | `/admin/products/{id}/` | Update product |
| DELETE | `/admin/products/{id}/` | Delete product |

### Admin Order Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/orders/` | List all orders (with filters) |
| GET | `/admin/orders/{id}/` | Get order details |
| PUT | `/admin/orders/{id}/update_status/` | Update order status |
| PUT | `/admin/orders/{id}/add_notes/` | Add admin notes |
| POST | `/admin/orders/export_csv/` | Export orders to CSV |

### Admin Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard/` | Get dashboard statistics |

---

## 🚢 Deployment

### Option 1: Render.com (Recommended - FREE)

#### Backend Deployment

1. **Push code to GitHub**

```bash
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Create Render Account**: https://render.com

3. **Create New Web Service**
   - Connect GitHub repository
   - Select `backend` folder (Root Directory: `backend`)
   - Build Command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput && python seed_data.py`
   - Start Command: `gunicorn ecommerce.wsgi:application`
   - Add Environment Variables:
     ```
     PYTHON_VERSION=3.11.0
     SECRET_KEY=<generate-strong-secret-key>
     DEBUG=False
     ALLOWED_HOSTS=your-app-name.onrender.com
     ```

4. **Create PostgreSQL Database** (optional, or use SQLite)
   - Render → New → PostgreSQL
   - Copy Internal Database URL
   - Add to Web Service Environment Variables:
     ```
     DATABASE_URL=<your-database-url>
     ```
   - Update `settings.py`:
   
```python
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}
```

#### Frontend Deployment

1. **Update API URL in App.jsx**

```javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

2. **Deploy to Render**
   - New → Static Site
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

### Option 2: Railway.app

1. **Install Railway CLI**: https://docs.railway.app/develop/cli
2. **Login**: `railway login`
3. **Deploy Backend**:
   ```bash
   cd backend
   railway init
   railway up
   ```
4. **Deploy Frontend** (Vercel or Netlify recommended)

### Option 3: Vercel (Frontend) + Render (Backend)

**Frontend** on Vercel:
```bash
cd frontend
npm install -g vercel
vercel
```

**Backend** on Render (same as Option 1)

---

## 🧪 Testing

### Manual Testing Checklist

#### User Flow
- [ ] Register new user account
- [ ] Login with user credentials
- [ ] Browse products and search
- [ ] Filter products by category
- [ ] Add products to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Checkout with shipping address
- [ ] View order confirmation
- [ ] Check order history

#### Admin Flow
- [ ] Login with admin credentials
- [ ] View dashboard statistics
- [ ] Create new product
- [ ] Edit existing product
- [ ] Delete product
- [ ] View all orders
- [ ] Filter orders by status
- [ ] Update order status
- [ ] Add admin notes to order
- [ ] Export orders to CSV

### API Testing with cURL

```bash
# Register User
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test@12345","password2":"Test@12345"}'

# Login User
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test@12345"}'

# Get Products
curl http://localhost:8000/api/products/

# Admin Login
curl -X POST http://localhost:8000/api/admin/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@12345"}'
```

---

## 📤 GitHub Setup & Push

```bash
# Initialize git (if not already done)
git init

# Create .gitignore
```

Create `.gitignore` in project root:

```
# Python
*.pyc
__pycache__/
venv/
env/
*.sqlite3
*.db
.env

# Node
node_modules/
dist/
build/
.DS_Store

# IDE
.vscode/
.idea/
*.swp
*.swo

# Misc
*.log
.coverage
```

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: E-commerce full stack application"

# Create repository on GitHub (via browser)
# Then add remote and push:

git remote add origin https://github.com/YOUR_USERNAME/ecommerce-fullstack.git
git branch -M main
git push -u origin main
```

---

## 📝 Assignment Submission

### Email Subject
```
Full Stack Developer Assignment – [Your Name]
```

### Email Body Template

```
Dear Hiring Team,

Please find my Full Stack Developer Assignment submission:

📦 GitHub Repository: https://github.com/YOUR_USERNAME/ecommerce-fullstack
🌐 Live Demo (Frontend): https://your-app.vercel.app
🔗 API Backend: https://your-backend.onrender.com
📹 Demo Video: [Optional - YouTube/Loom link]

Admin Credentials:
Username: admin
Password: Admin@12345

Features Implemented:
✅ User Registration & Login (JWT)
✅ Product Browsing with Search & Filters
✅ Shopping Cart & Checkout
✅ Order Management
✅ Admin Panel with Complete CRUD
✅ Order Status Updates
✅ CSV Export
✅ Dashboard Statistics
✅ Responsive Design

Tech Stack:
- Backend: Django + DRF + SQLite
- Frontend: React + Vite + Tailwind CSS
- Authentication: JWT
- Deployment: Render.com / Vercel

Thank you for your consideration!

Best regards,
[Your Name]
[Your Contact]
```

---

## 🐛 Troubleshooting

### Backend Issues

**CORS Error**
```python
# Check settings.py CORS_ALLOWED_ORIGINS includes frontend URL
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

**Migration Errors**
```bash
# Delete db.sqlite3 and migrations, then:
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
python manage.py makemigrations
python manage.py migrate
python seed_data.py
```

**Module Not Found**
```bash
# Reinstall requirements
pip install -r requirements.txt
```

### Frontend Issues

**API Connection Failed**
- Check if backend is running on port 8000
- Verify API_BASE_URL in App.jsx
- Check browser console for CORS errors

**Build Errors**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

This project is created for assignment purposes.

---

## 👨‍💻 Developer Notes

- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Products support image URLs (not file uploads for simplicity)
- SQLite is used for development (switch to PostgreSQL for production)
- Admin panel uses Django's built-in admin + custom React admin interface
- CSV export includes order ID, customer, status, items, and shipping details

---

## 🎯 Assignment Completion Checklist

- [x] User Registration & Login (JWT)
- [x] Browse Products
- [x] Add to Cart
- [x] Checkout & Place Order
- [x] Admin Authentication (Role-based)
- [x] Admin Dashboard with Stats
- [x] Products CRUD
- [x] Orders Management
- [x] Order Status Updates
- [x] Search & Filter
- [x] CSV Export
- [x] Responsive Design
- [x] API Documentation
- [x] Deployment Instructions
- [x] README Documentation
- [x] Seed Data Script
- [x] Admin Credentials Provided

---

 