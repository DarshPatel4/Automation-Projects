from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Website, Page
from .serializers import WebsiteSerializer, PageSerializer

class WebsiteViewSet(viewsets.ModelViewSet):
    queryset = Website.objects.all().prefetch_related('pages')
    serializer_class = WebsiteSerializer

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        website = self.get_object()
        website.is_published = True
        website.published_at = timezone.now()
        website.save()
        return Response({
            'status': 'published',
            'subdomain': f"https://{website.subdomain}.apexbuilder.com",
            'published_at': website.published_at
        }, status=status.HTTP_200_OK)


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        website_id = self.request.query_params.get('website')
        if website_id:
            queryset = queryset.filter(website_id=website_id)
        return queryset
