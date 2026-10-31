from rest_framework import serializers
from .models import Template, TemplateCategory

class TemplateCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateCategory
        fields = ['id', 'name', 'slug']


class TemplateSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Template
        fields = [
            'id', 'title', 'slug', 'category', 'category_name',
            'description', 'thumbnail', 'theme_config', 'template_nodes',
            'is_premium', 'created_at'
        ]

