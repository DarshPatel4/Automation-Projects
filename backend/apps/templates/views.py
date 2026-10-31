from rest_framework import viewsets
from .models import Template, TemplateCategory
from .serializers import TemplateSerializer, TemplateCategorySerializer

class TemplateCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TemplateCategory.objects.all()
    serializer_class = TemplateCategorySerializer


class TemplateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Template.objects.all().select_related('category')
    serializer_class = TemplateSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset
