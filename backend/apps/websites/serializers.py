from rest_framework import serializers
from .models import Website, Page

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = [
            'id', 'website', 'title', 'slug', 'is_home',
            'root_node_id', 'nodes', 'seo_title', 'seo_description',
            'custom_css', 'custom_head_script', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class WebsiteSerializer(serializers.ModelSerializer):
    pages = PageSerializer(many=True, read_only=True)

    class Meta:
        model = Website
        fields = [
            'id', 'owner', 'name', 'slug', 'subdomain',
            'custom_domain', 'theme_config', 'is_published',
            'published_at', 'pages', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

