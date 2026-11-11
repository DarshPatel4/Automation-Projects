import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.websites.models import Workspace, Website, Page, CMSCollectionRecord
from apps.templates.models import Template, TemplateCategory

def seed():
    print("Seeding initial workspaces, categories, templates, and default project with DB config...")

    # Seed Default Workspaces (Folders)
    client_ws, _ = Workspace.objects.get_or_create(
        slug='client-projects',
        defaults={
            'name': 'Client Deliverables',
            'description': 'Commercial production websites and client deliverables',
            'icon': 'Briefcase',
            'color': '#6366f1',
        }
    )

    personal_ws, _ = Workspace.objects.get_or_create(
        slug='personal-brands',
        defaults={
            'name': 'Personal Brands',
            'description': 'Portfolios, creator hubs, and resume websites',
            'icon': 'User',
            'color': '#ec4899',
        }
    )

    ecommerce_ws, _ = Workspace.objects.get_or_create(
        slug='ecommerce-stores',
        defaults={
            'name': 'E-Commerce Stores',
            'description': 'Shopify & WooCommerce style digital storefronts',
            'icon': 'ShoppingBag',
            'color': '#10b981',
        }
    )

    # Categories
    saas_cat, _ = TemplateCategory.objects.get_or_create(name='SaaS', slug='saas')
    portfolio_cat, _ = TemplateCategory.objects.get_or_create(name='Portfolio', slug='portfolio')
    ecom_cat, _ = TemplateCategory.objects.get_or_create(name='E-commerce', slug='e-commerce')
    health_cat, _ = TemplateCategory.objects.get_or_create(name='Healthcare', slug='healthcare')
    food_cat, _ = TemplateCategory.objects.get_or_create(name='Restaurant', slug='restaurant')

    # Seed Templates
    Template.objects.get_or_create(
        slug='nexus-cloud-infrastructure',
        defaults={
            'title': 'Nexus Cloud Infrastructure',
            'category': saas_cat,
            'description': 'Enterprise high-converting dark/light cloud infrastructure landing page with live metrics, 3 feature cards, and Lucide vector icons.',
            'thumbnail': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
            'theme_config': {
                'primaryColor': '#4f46e5',
                'fontFamily': 'Inter, sans-serif'
            },
            'template_nodes': {},
            'is_premium': False,
        }
    )

    Template.objects.get_or_create(
        slug='minimal-creator-studio',
        defaults={
            'title': 'Minimal Creator Studio',
            'category': portfolio_cat,
            'description': 'Clean typography-first portfolio for designers, developers, and creative agencies.',
            'thumbnail': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
            'theme_config': {
                'primaryColor': '#0f172a',
                'fontFamily': 'Plus Jakarta Sans, sans-serif'
            },
            'template_nodes': {},
            'is_premium': False,
        }
    )

    Template.objects.get_or_create(
        slug='solis-modern-storefront',
        defaults={
            'title': 'Solis Modern Storefront',
            'category': ecom_cat,
            'description': 'Clean DTC lifestyle brand storefront with hero banner, product grid, and fast checkout call-to-actions.',
            'thumbnail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
            'theme_config': {
                'primaryColor': '#0d9488',
                'fontFamily': 'Plus Jakarta Sans, sans-serif'
            },
            'template_nodes': {},
            'is_premium': False,
        }
    )

    # 1. Dynamic Website: Nexus Cloud Platform (With Inbuilt DB & Leads Collection)
    site, created = Website.objects.get_or_create(
        subdomain='apex-demo',
        defaults={
            'name': 'Nexus Cloud Platform',
            'slug': 'nexus-cloud-platform',
            'workspace': client_ws,
            'site_type': 'dynamic',
            'storage_usage_bytes': 1024 * 1024 * 12, # 12 MB
            'db_config': {
                'engine': 'sqlite',
                'is_inbuilt': True,
                'status': 'connected',
                'latency_ms': 2,
                'database_name': 'nexus_managed_db.sqlite3',
            },
            'collections_schema': [
                {
                    'name': 'leads',
                    'label': 'Inbound Contact Leads',
                    'fields': ['fullName', 'email', 'company', 'budget', 'message'],
                },
                {
                    'name': 'testimonials',
                    'label': 'Customer Testimonials',
                    'fields': ['author', 'company', 'quote', 'rating'],
                }
            ],
            'theme_config': {
                'primaryColor': '#4f46e5',
                'fontFamily': 'Inter, sans-serif',
                'borderRadius': '8px'
            },
            'is_published': True,
        }
    )
    if not created:
        site.site_type = 'dynamic'
        site.workspace = client_ws
        site.storage_usage_bytes = 1024 * 1024 * 12
        site.db_config = {
            'engine': 'sqlite',
            'is_inbuilt': True,
            'status': 'connected',
            'latency_ms': 2,
            'database_name': 'nexus_managed_db.sqlite3',
        }
        site.collections_schema = [
            {
                'name': 'leads',
                'label': 'Inbound Contact Leads',
                'fields': ['fullName', 'email', 'company', 'budget', 'message'],
            },
            {
                'name': 'testimonials',
                'label': 'Customer Testimonials',
                'fields': ['author', 'company', 'quote', 'rating'],
            }
        ]
        site.save()

    # Seed Sample CMS Record
    CMSCollectionRecord.objects.get_or_create(
        website=site,
        collection_name='leads',
        defaults={
            'data': {
                'fullName': 'Sarah Jenkins',
                'email': 'sarah@vertexcorp.io',
                'company': 'Vertex Solutions',
                'budget': '$25,000+',
                'message': 'Interested in migrating our global edge infrastructure to Nexus.',
            }
        }
    )

    # 2. Dynamic Website: Solis Storefront (With Inbuilt DB & Products)
    ecom_site, ecom_created = Website.objects.get_or_create(
        subdomain='solis-store',
        defaults={
            'name': 'Solis Modern Storefront',
            'slug': 'solis-modern-storefront',
            'workspace': ecommerce_ws,
            'site_type': 'dynamic',
            'storage_usage_bytes': 1024 * 1024 * 48, # 48 MB
            'db_config': {
                'engine': 'sqlite',
                'is_inbuilt': True,
                'status': 'connected',
                'latency_ms': 3,
                'database_name': 'solis_catalog.sqlite3',
            },
            'collections_schema': [
                {
                    'name': 'products',
                    'label': 'Store Products',
                    'fields': ['title', 'price', 'sku', 'inStock', 'imageUrl'],
                }
            ],
            'theme_config': {
                'primaryColor': '#0d9488',
                'fontFamily': 'Plus Jakarta Sans, sans-serif',
            },
            'is_published': False,
        }
    )

    # 3. Static Website: Minimal Creator Studio (View-Only / No DB)
    static_site, static_created = Website.objects.get_or_create(
        subdomain='creator-studio',
        defaults={
            'name': 'Minimal Creator Studio',
            'slug': 'minimal-creator-studio',
            'workspace': personal_ws,
            'site_type': 'static',
            'storage_usage_bytes': 1024 * 380, # 380 KB (ultra-lightweight static)
            'db_config': {},
            'collections_schema': [],
            'theme_config': {
                'primaryColor': '#0f172a',
                'fontFamily': 'Plus Jakarta Sans, sans-serif',
            },
            'is_published': True,
        }
    )

    print("Database seeding completed with Static & Dynamic (Inbuilt DB) websites!")

if __name__ == '__main__':
    seed()
