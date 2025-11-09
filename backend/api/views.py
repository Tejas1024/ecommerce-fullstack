from rest_framework import generics, status, viewsets, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db.models import Q, Sum, Count
from django.http import HttpResponse
from .models import Product, Category, Cart, Order, OrderItem
from .serializers import (
    UserRegistrationSerializer, UserSerializer, ProductSerializer,
    CategorySerializer, CartSerializer, OrderSerializer, OrderCreateSerializer,
    OrderItemSerializer
)
from .permissions import IsAdmin
import csv
from datetime import datetime
from io import StringIO
import json
from django.utils.text import slugify

User = get_user_model()

# ============= Authentication Views =============
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# ============= Admin Auth Views =============
@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(username=username)
        if user.check_password(password) and user.role == 'admin':
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Admin login successful',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        return Response({'error': 'Invalid admin credentials'}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return Response({'error': 'Invalid admin credentials'}, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# ============= Public Product Views =============
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if category:
            queryset = queryset.filter(category__slug=category)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

# ============= Cart Views =============
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def create(self, request):
        product_id = request.data.get('product')
        quantity = request.data.get('quantity', 1)
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
            if product.stock < int(quantity):
                return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
            
            cart_item, created = Cart.objects.get_or_create(
                user=request.user,
                product=product,
                defaults={'quantity': quantity}
            )
            
            if not created:
                cart_item.quantity += int(quantity)
                if cart_item.quantity > product.stock:
                    return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
                cart_item.save()
            
            serializer = CartSerializer(cart_item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        try:
            cart_item = Cart.objects.get(pk=pk, user=request.user)
            quantity = request.data.get('quantity', 1)
            
            if cart_item.product.stock < int(quantity):
                return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
            
            cart_item.quantity = quantity
            cart_item.save()
            
            serializer = CartSerializer(cart_item)
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        Cart.objects.filter(user=request.user).delete()
        return Response({'message': 'Cart cleared'}, status=status.HTTP_204_NO_CONTENT)

# ============= Order Views =============
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def create(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        cart_items = Cart.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        total_amount = sum(item.total_price for item in cart_items)
        
        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            **serializer.validated_data
        )
        
        for cart_item in cart_items:
            if cart_item.product.stock < cart_item.quantity:
                order.delete()
                return Response({
                    'error': f'Insufficient stock for {cart_item.product.name}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()
        
        cart_items.delete()
        
        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data, status=status.HTTP_201_CREATED)

# ============= Admin Product Views =============
class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug', 'category__name']
    ordering_fields = ['price', 'stock', 'created_at']
    
    @action(detail=False, methods=['post'])
    def import_products(self, request):
        """
        Bulk import products from CSV or JSON file
        POST /api/admin/products/import/
        """
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            file_content = file.read().decode('utf-8')
            imported_count = 0
            errors = []
            
            # Detect file type
            if file.name.endswith('.json'):
                # Handle JSON import
                products_data = json.loads(file_content)
                
                for idx, product_data in enumerate(products_data):
                    try:
                        # Get or create category
                        category_name = product_data.get('category', 'Uncategorized')
                        category, _ = Category.objects.get_or_create(
                            name=category_name,
                            defaults={'slug': slugify(category_name)}
                        )
                        
                        # Create product
                        Product.objects.create(
                            name=product_data['name'],
                            slug=product_data.get('slug', slugify(product_data['name'])),
                            category=category,
                            description=product_data.get('description', ''),
                            price=product_data['price'],
                            weight=product_data.get('weight', 0),
                            stock=product_data.get('stock', 0),
                            image=product_data.get('image', ''),
                            is_active=product_data.get('is_active', True)
                        )
                        imported_count += 1
                    except Exception as e:
                        errors.append(f"Row {idx + 1}: {str(e)}")
            
            elif file.name.endswith('.csv'):
                # Handle CSV import
                csv_file = StringIO(file_content)
                reader = csv.DictReader(csv_file)
                
                for idx, row in enumerate(reader):
                    try:
                        category_name = row.get('category', 'Uncategorized')
                        category, _ = Category.objects.get_or_create(
                            name=category_name,
                            defaults={'slug': slugify(category_name)}
                        )
                        
                        Product.objects.create(
                            name=row['name'],
                            slug=row.get('slug', slugify(row['name'])),
                            category=category,
                            description=row.get('description', ''),
                            price=float(row['price']),
                            weight=float(row.get('weight', 0)),
                            stock=int(row.get('stock', 0)),
                            image=row.get('image', ''),
                            is_active=row.get('is_active', 'true').lower() == 'true'
                        )
                        imported_count += 1
                    except Exception as e:
                        errors.append(f"Row {idx + 2}: {str(e)}")  # +2 because of header
            else:
                return Response(
                    {'error': 'Invalid file format. Please upload CSV or JSON'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response({
                'message': f'Successfully imported {imported_count} products',
                'imported_count': imported_count,
                'errors': errors
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Import failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

# ============= Admin Order Views ============= 
class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['order_id', 'user__email', 'user__username']
    ordering_fields = ['created_at', 'total_amount']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
        
        return queryset
    
    @action(detail=True, methods=['put'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['put'])
    def add_notes(self, request, pk=None):
        order = self.get_object()
        notes = request.data.get('notes', '')
        order.admin_notes = notes
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def export_csv(self, request):
        order_ids = request.data.get('order_ids', [])
        
        if order_ids:
            orders = Order.objects.filter(id__in=order_ids)
        else:
            orders = self.get_queryset()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="orders_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Order ID', 'Customer Email', 'Status', 'Total Amount', 'Items', 'Shipping Address', 'Created At'])
        
        for order in orders:
            items = ', '.join([f"{item.product.name} x {item.quantity}" for item in order.items.all()])
            address = f"{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}"
            writer.writerow([
                order.order_id,
                order.user.email,
                order.status,
                order.total_amount,
                items,
                address,
                order.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response

# ============= Admin Dashboard Stats =============
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_dashboard_stats(request):
    total_orders = Order.objects.count()
    pending_orders = Order.objects.filter(status='Pending').count()
    total_revenue = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0
    total_products = Product.objects.count()
    
    recent_orders = Order.objects.all()[:5]
    recent_orders_data = OrderSerializer(recent_orders, many=True).data
    
    return Response({
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'total_revenue': float(total_revenue),
        'total_products': total_products,
        'recent_orders': recent_orders_data
    })
