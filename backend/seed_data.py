import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.websites.models import Workspace, Website, Page
from apps.templates.models import Template, TemplateCategory

def seed():
    print("Seeding initial workspaces, categories, templates, and default project...")

    # Seed Default Workspaces (Folders)
    client_ws, _ = Workspace.objects.get_or_create(
        slug='client-projects',
        defaults={
            'name': 'Client Projects',
            'description': 'Commercial production websites and client deliverables',
            'icon': 'Briefcase',
            'color': '#6366f1',
        }
    )

    personal_ws, _ = Workspace.objects.get_or_create(
        slug='personal-brands',
        defaults={
            'name': 'Personal Brands & Portfolios',
            'description': 'Personal portfolios, creator hubs, and resume websites',
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

    # Seed Default Website Project with Workspace
    site, created = Website.objects.get_or_create(
        subdomain='apex-demo',
        defaults={
            'name': 'Nexus Cloud Platform',
            'slug': 'nexus-cloud-platform',
            'workspace': client_ws,
            'theme_config': {
                'primaryColor': '#4f46e5',
                'fontFamily': 'Inter, sans-serif',
                'borderRadius': '8px'
            },
            'is_published': True,
        }
    )
    if not created and not site.workspace:
        site.workspace = client_ws
        site.save()

    if created:
        Page.objects.create(
            website=site,
            title='Home',
            slug='/',
            is_home=True,
            root_node_id='root',
            nodes={},
            seo_title='Nexus Cloud | Next-Generation Edge Network',
            seo_description='Deploy global web applications with zero cold starts and sub-millisecond edge routing.'
        )

    print("Database seeding completed successfully with Workspaces & Templates!")

if __name__ == '__main__':
    seed()
