from rest_framework import serializers
from .models import Workspace, Website, Page, CMSCollectionRecord

class WorkspaceSerializer(serializers.ModelSerializer):
    websites_count = serializers.SerializerMethodField()
    total_storage_bytes = serializers.SerializerMethodField()

    class Meta:
        model = Workspace
        fields = [
            'id', 'owner', 'name', 'slug', 'description',
            'icon', 'color', 'websites_count', 'total_storage_bytes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_websites_count(self, obj):
        return obj.websites.count()

    def get_total_storage_bytes(self, obj):
        return sum(site.storage_usage_bytes for site in obj.websites.all())


class CMSCollectionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CMSCollectionRecord
        fields = ['id', 'website', 'collection_name', 'data', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


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
    workspace_name = serializers.CharField(source='workspace.name', read_only=True)
    cms_records_count = serializers.SerializerMethodField()

    class Meta:
        model = Website
        fields = [
            'id', 'owner', 'workspace', 'workspace_name', 'name', 'slug',
            'site_type', 'subdomain', 'custom_domain', 'theme_config',
            'db_config', 'collections_schema', 'storage_usage_bytes',
            'is_published', 'published_at', 'pages', 'cms_records_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_cms_records_count(self, obj):
        return obj.cms_records.count()
