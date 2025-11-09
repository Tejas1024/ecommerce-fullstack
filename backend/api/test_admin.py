from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Category, Product, Order, OrderItem
from decimal import Decimal

class AdminAuthTestCase(TestCase):
    """Test admin authentication"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='testadmin',
            email='admin@test.com',
            password='Admin@123',
            role='admin',
            is_staff=True
        )
        self.user = User.objects.create_user(
            username='testuser',
            email='user@test.com',
            password='User@123',
            role='user'
        )
    
    def test_TC_A1_admin_login_valid(self):
        """TC-A1: POST /api/admin/login with valid credentials"""
        response = self.client.post('/api/admin/login/', {
            'username': 'testadmin',
            'password': 'Admin@123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertEqual(response.data['user']['role'], 'admin')
    
    def test_TC_A1_admin_login_invalid(self):
        """TC-A1: POST /api/admin/login with invalid credentials"""
        response = self.client.post('/api/admin/login/', {
            'username': 'testadmin',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_TC_A1_user_cannot_admin_login(self):
        """TC-A1: Regular user cannot login as admin"""
        response = self.client.post('/api/admin/login/', {
            'username': 'testuser',
            'password': 'User@123'
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class AdminProductTestCase(TestCase):
    """Test admin product management"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='testadmin',
            password='Admin@123',
            role='admin',
            is_staff=True
        )
        self.category = Category.objects.create(
            name='Electronics',
            slug='electronics'
        )
        
        # Login and get token
        response = self.client.post('/api/admin/login/', {
            'username': 'testadmin',
            'password': 'Admin@123'
        })
        self.token = response.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_TC_A2_get_products_returns_200(self):
        """TC-A2: GET /api/admin/products returns 200 and paginated list"""
        response = self.client.get('/api/admin/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, (list, dict))
    
    def test_TC_A3_create_product_missing_fields(self):
        """TC-A3: POST /api/admin/products with missing fields returns 400"""
        response = self.client.post('/api/admin/products/', {
            'name': 'Test Product'
            # Missing required fields: slug, category, price, etc.
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_TC_A3_create_product_valid(self):
        """TC-A3: POST /api/admin/products with valid data"""
        response = self.client.post('/api/admin/products/', {
            'name': 'Test Product',
            'slug': 'test-product',
            'category': self.category.id,
            'description': 'Test description',
            'price': '99.99',
            'weight': '1.5',
            'stock': 10,
            'is_active': True
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Test Product')
    
    def test_TC_A4_update_product(self):
        """TC-A4: PUT /api/admin/products/:id updates product fields correctly"""
        # Create product
        product = Product.objects.create(
            name='Original Product',
            slug='original-product',
            category=self.category,
            description='Original description',
            price=Decimal('50.00'),
            weight=Decimal('1.0'),
            stock=5
        )
        
        # Update product
        response = self.client.put(f'/api/admin/products/{product.id}/', {
            'name': 'Updated Product',
            'slug': 'updated-product',
            'category': self.category.id,
            'description': 'Updated description',
            'price': '75.00',
            'weight': '2.0',
            'stock': 15,
            'is_active': True
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Product')
        self.assertEqual(float(response.data['price']), 75.00)
        
        # Verify in database
        product.refresh_from_db()
        self.assertEqual(product.name, 'Updated Product')
        self.assertEqual(product.stock, 15)
    
    def test_TC_A5_delete_product(self):
        """TC-A5: DELETE /api/admin/products/:id removes product"""
        product = Product.objects.create(
            name='Product To Delete',
            slug='product-to-delete',
            category=self.category,
            description='Will be deleted',
            price=Decimal('25.00'),
            weight=Decimal('0.5'),
            stock=3
        )
        
        response = self.client.delete(f'/api/admin/products/{product.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify product is deleted
        self.assertFalse(Product.objects.filter(id=product.id).exists())


class AdminOrderTestCase(TestCase):
    """Test admin order management"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='testadmin',
            password='Admin@123',
            role='admin',
            is_staff=True
        )
        self.user = User.objects.create_user(
            username='testuser',
            password='User@123',
            role='user'
        )
        self.category = Category.objects.create(
            name='Electronics',
            slug='electronics'
        )
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            category=self.category,
            description='Test',
            price=Decimal('100.00'),
            weight=Decimal('1.0'),
            stock=10
        )
        
        # Create test order
        self.order = Order.objects.create(
            user=self.user,
            status='Pending',
            total_amount=Decimal('100.00'),
            shipping_address='123 Test St',
            shipping_city='Test City',
            shipping_state='Test State',
            shipping_pincode='123456',
            shipping_phone='1234567890'
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=1,
            price=Decimal('100.00')
        )
        
        # Login as admin
        response = self.client.post('/api/admin/login/', {
            'username': 'testadmin',
            'password': 'Admin@123'
        })
        self.token = response.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
    
    def test_TC_A6_filter_orders_by_status(self):
        """TC-A6: GET /api/admin/orders?status=Pending filters results"""
        response = self.client.get('/api/admin/orders/?status=Pending')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        orders = response.data if isinstance(response.data, list) else response.data.get('results', [])
        for order in orders:
            self.assertEqual(order['status'], 'Pending')
    
    def test_TC_A7_update_order_status(self):
        """TC-A7: PUT /api/admin/orders/:id/status updates status and persists"""
        response = self.client.put(
            f'/api/admin/orders/{self.order.id}/update_status/',
            {'status': 'Processing'}
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Processing')
        
        # Verify persistence
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'Processing')
    
    def test_TC_A7_update_order_invalid_status(self):
        """TC-A7: Update order with invalid status returns error"""
        response = self.client.put(
            f'/api/admin/orders/{self.order.id}/update_status/',
            {'status': 'InvalidStatus'}
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AdminSecurityTestCase(TestCase):
    """Test admin security and authorization"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='User@123',
            role='user'
        )
    
    def test_TC_A8_unauthorized_user_receives_401(self):
        """TC-A8: Unauthorized user calling admin endpoints receives 401"""
        response = self.client.get('/api/admin/products/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_TC_A8_regular_user_receives_403(self):
        """TC-A8: Regular user (not admin) calling admin endpoints receives 403"""
        # Login as regular user
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'User@123'
        })
        token = response.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # Try to access admin endpoint
        response = self.client.get('/api/admin/products/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_TC_A8_admin_dashboard_unauthorized(self):
        """TC-A8: Dashboard endpoint requires admin"""
        response = self.client.get('/api/admin/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)