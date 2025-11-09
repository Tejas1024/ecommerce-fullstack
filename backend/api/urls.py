from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'cart', views.CartViewSet, basename='cart')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'admin/products', views.AdminProductViewSet, basename='admin-product')
router.register(r'admin/orders', views.AdminOrderViewSet, basename='admin-order')

urlpatterns = [
    # Auth endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/profile/', views.profile, name='profile'),
    
    # Admin auth endpoints
    path('admin/login/', views.admin_login, name='admin-login'),
    path('admin/profile/', views.admin_profile, name='admin-profile'),
    path('admin/dashboard/', views.admin_dashboard_stats, name='admin-dashboard'),
    
    # Public product endpoints
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    
    # Router URLs
    path('', include(router.urls)),
]