import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.websites.models import Website, Page
from apps.templates.models import Template, TemplateCategory

def seed():
    print("Seeding initial categories, templates, and default project...")

    # Categories
    saas_cat, _ = TemplateCategory.objects.get_or_create(name='SaaS', slug='saas')
    portfolio_cat, _ = TemplateCategory.objects.get_or_create(name='Portfolio', slug='portfolio')
    ecom_cat, _ = TemplateCategory.objects.get_or_create(name='E-commerce', slug='e-commerce')
    health_cat, _ = TemplateCategory.objects.get_or_create(name='Healthcare', slug='healthcare')
    food_cat, _ = TemplateCategory.objects.get_or_create(name='Restaurant', slug='restaurant')

    # Seed Templates
    Template.objects.get_or_create(
        slug='apex-saas-modern',
        defaults={
            'title': 'Apex SaaS Modern',
            'category': saas_cat,
            'description': 'High-converting dark/light SaaS landing page with pricing, features grid, and metric counters.',
            'thumbnail': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
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

    # Seed Default Website Project
    site, created = Website.objects.get_or_create(
        subdomain='apex-demo',
        defaults={
            'name': 'Apex SaaS Landing Page',
            'slug': 'apex-saas-landing-page',
            'theme_config': {
                'primaryColor': '#4f46e5',
                'fontFamily': 'Inter, sans-serif',
                'borderRadius': '8px'
            },
            'is_published': True,
        }
    )

    if created:
        Page.objects.create(
            website=site,
            title='Home',
            slug='/',
            is_home=True,
            root_node_id='root',
            nodes={},
            seo_title='ApexBuilder | Visual SaaS Website Builder',
            seo_description='Create professional responsive websites without coding.'
        )

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
