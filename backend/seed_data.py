"""
Seed script to populate database with initial data
Run: python seed_data.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from api.models import User, Category, Product
from django.utils.text import slugify

def create_admin():
    """Create admin user"""
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='Admin@12345',
            first_name='Admin',
            last_name='User',
            role='admin',
            is_staff=True,
            is_superuser=True
        )
        print("✅ Admin user created: admin / Admin@12345")
    else:
        print("ℹ️  Admin user already exists")

def create_categories():
    """Create product categories"""
    categories = [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Kitchen',
        'Sports',
        'Toys',
        'Beauty',
        'Automotive'
    ]
    
    created = 0
    for cat_name in categories:
        cat, created_new = Category.objects.get_or_create(
            name=cat_name,
            defaults={'slug': slugify(cat_name)}
        )
        if created_new:
            created += 1
    
    print(f"✅ Created {created} categories")

def create_products():
    """Create sample products"""
    products = [
        {
            'name': 'Wireless Bluetooth Headphones',
            'category': 'Electronics',
            'description': 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
            'price': 2999.00,
            'weight': 0.25,
            'stock': 50,
            'image': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
        },
        {
            'name': 'Smart Watch Series 5',
            'category': 'Electronics',
            'description': 'Latest smartwatch with health tracking, GPS, and waterproof design.',
            'price': 15999.00,
            'weight': 0.15,
            'stock': 30,
            'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
        },
        {
            'name': 'Cotton T-Shirt (Pack of 3)',
            'category': 'Clothing',
            'description': 'Comfortable 100% cotton t-shirts in assorted colors.',
            'price': 799.00,
            'weight': 0.40,
            'stock': 100,
            'image': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
        },
        {
            'name': 'Denim Jeans - Slim Fit',
            'category': 'Clothing',
            'description': 'Classic slim fit denim jeans with stretch comfort.',
            'price': 1499.00,
            'weight': 0.60,
            'stock': 75,
            'image': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'
        },
        {
            'name': 'The Complete Python Guide',
            'category': 'Books',
            'description': 'Comprehensive guide to Python programming for beginners to advanced.',
            'price': 599.00,
            'weight': 0.80,
            'stock': 40,
            'image': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500'
        },
        {
            'name': 'Fiction Novel - Bestseller',
            'category': 'Books',
            'description': 'Award-winning fiction novel by renowned author.',
            'price': 399.00,
            'weight': 0.50,
            'stock': 60,
            'image': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
        },
        {
            'name': 'Non-Stick Cookware Set',
            'category': 'Home & Kitchen',
            'description': '5-piece non-stick cookware set with glass lids.',
            'price': 3499.00,
            'weight': 4.50,
            'stock': 25,
            'image': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500'
        },
        {
            'name': 'Electric Kettle 1.8L',
            'category': 'Home & Kitchen',
            'description': 'Fast boiling electric kettle with auto shut-off feature.',
            'price': 899.00,
            'weight': 1.20,
            'stock': 45,
            'image': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500'
        },
        {
            'name': 'Yoga Mat with Carry Bag',
            'category': 'Sports',
            'description': 'Premium quality yoga mat with excellent grip and cushioning.',
            'price': 1299.00,
            'weight': 1.50,
            'stock': 35,
            'image': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'
        },
        {
            'name': 'Resistance Bands Set',
            'category': 'Sports',
            'description': 'Set of 5 resistance bands for home workout.',
            'price': 799.00,
            'weight': 0.80,
            'stock': 50,
            'image': 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500'
        },
        {
            'name': 'Educational Building Blocks',
            'category': 'Toys',
            'description': 'Creative building blocks set for kids aged 3+.',
            'price': 1199.00,
            'weight': 2.00,
            'stock': 40,
            'image': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'
        },
        {
            'name': 'Remote Control Car',
            'category': 'Toys',
            'description': 'High-speed RC car with rechargeable battery.',
            'price': 2499.00,
            'weight': 1.80,
            'stock': 20,
            'image': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
        },
        {
            'name': 'Skincare Gift Set',
            'category': 'Beauty',
            'description': 'Complete skincare routine set with cleanser, toner, and moisturizer.',
            'price': 1999.00,
            'weight': 0.70,
            'stock': 30,
            'image': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'
        },
        {
            'name': 'Hair Straightener',
            'category': 'Beauty',
            'description': 'Ceramic hair straightener with adjustable temperature.',
            'price': 1599.00,
            'weight': 0.50,
            'stock': 25,
            'image': 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500'
        },
        {
            'name': 'Car Phone Holder',
            'category': 'Automotive',
            'description': 'Universal car phone mount with 360-degree rotation.',
            'price': 399.00,
            'weight': 0.20,
            'stock': 80,
            'image': 'https://images.unsplash.com/photo-1591768575649-dcc9e2f9c1e1?w=500'
        },
        {
            'name': 'Car Vacuum Cleaner',
            'category': 'Automotive',
            'description': 'Portable car vacuum with powerful suction.',
            'price': 1899.00,
            'weight': 1.00,
            'stock': 35,
            'image': 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500'
        },
    ]
    
    created = 0
    for prod_data in products:
        category = Category.objects.get(name=prod_data['category'])
        
        slug = slugify(prod_data['name'])
        if not Product.objects.filter(slug=slug).exists():
            Product.objects.create(
                name=prod_data['name'],
                slug=slug,
                category=category,
                description=prod_data['description'],
                price=prod_data['price'],
                weight=prod_data['weight'],
                stock=prod_data['stock'],
                image=prod_data['image'],
                is_active=True
            )
            created += 1
    
    print(f"✅ Created {created} products")

def main():
    print("🌱 Seeding database...")
    print("=" * 50)
    
    create_admin()
    create_categories()
    create_products()
    
    print("=" * 50)
    print("✅ Database seeded successfully!")
    print("\n📝 Admin Credentials:")
    print("   Username: admin")
    print("   Password: Admin@12345")
    print("\n🚀 You can now run the server!")

if __name__ == '__main__':
    main()