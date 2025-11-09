from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.http import HttpResponse
from .models import User, Category, Product, Cart, Order, OrderItem
import csv

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    readonly_fields = ['date_joined', 'last_login']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'product_count', 'created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'stock', 'is_active']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'category', 'description')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'weight', 'stock', 'is_active')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price', 'get_total']
    can_delete = False
    
    def get_total(self, obj):
        return f"₹{obj.total_price}"
    get_total.short_description = 'Total'

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'user', 'status', 'total_amount', 'created_at', 'order_actions']
    list_filter = ['status', 'created_at']
    search_fields = ['order_id', 'user__username', 'user__email']
    readonly_fields = ['order_id', 'created_at', 'updated_at', 'user', 'total_amount']
    inlines = [OrderItemInline]
    actions = ['export_as_csv', 'mark_as_processing', 'mark_as_shipped', 'mark_as_delivered']
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_id', 'user', 'status', 'total_amount')
        }),
        ('Shipping Details', {
            'fields': ('shipping_address', 'shipping_city', 'shipping_state', 'shipping_pincode', 'shipping_phone')
        }),
        ('Admin Notes', {
            'fields': ('admin_notes',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def order_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">View Details</a>',
            reverse('admin:api_order_change', args=[obj.pk])
        )
    order_actions.short_description = 'Actions'
    
    def export_as_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="orders.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Order ID', 'Customer', 'Email', 'Status', 'Total', 'Date'])
        
        for order in queryset:
            writer.writerow([
                order.order_id,
                order.user.username,
                order.user.email,
                order.status,
                order.total_amount,
                order.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response
    export_as_csv.short_description = "Export Selected Orders to CSV"
    
    def mark_as_processing(self, request, queryset):
        queryset.update(status='Processing')
    mark_as_processing.short_description = "Mark as Processing"
    
    def mark_as_shipped(self, request, queryset):
        queryset.update(status='Shipped')
    mark_as_shipped.short_description = "Mark as Shipped"
    
    def mark_as_delivered(self, request, queryset):
        queryset.update(status='Delivered')
    mark_as_delivered.short_description = "Mark as Delivered"

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'quantity', 'get_total', 'created_at']
    search_fields = ['user__username', 'product__name']
    readonly_fields = ['created_at']
    
    def get_total(self, obj):
        return f"₹{obj.total_price}"
    get_total.short_description = 'Total Price'
