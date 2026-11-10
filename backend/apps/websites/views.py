from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Workspace, Website, Page
from .serializers import WorkspaceSerializer, WebsiteSerializer, PageSerializer

class WorkspaceViewSet(viewsets.ModelViewSet):
    queryset = Workspace.objects.all().prefetch_related('websites')
    serializer_class = WorkspaceSerializer


class WebsiteViewSet(viewsets.ModelViewSet):
    queryset = Website.objects.all().prefetch_related('pages', 'workspace')
    serializer_class = WebsiteSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        workspace_id = self.request.query_params.get('workspace')
        if workspace_id:
            queryset = queryset.filter(workspace_id=workspace_id)
        return queryset

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

    @action(detail=True, methods=['post'])
    def move_workspace(self, request, pk=None):
        website = self.get_object()
        workspace_id = request.data.get('workspace_id')
        if workspace_id:
            try:
                workspace = Workspace.objects.get(id=workspace_id)
                website.workspace = workspace
            except Workspace.DoesNotExist:
                return Response({'error': 'Workspace not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            website.workspace = None
        website.save()
        return Response(WebsiteSerializer(website).data, status=status.HTTP_200_OK)


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        website_id = self.request.query_params.get('website')
        if website_id:
            queryset = queryset.filter(website_id=website_id)
        return queryset
