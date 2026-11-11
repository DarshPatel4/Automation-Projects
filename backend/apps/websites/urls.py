from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkspaceViewSet, WebsiteViewSet, PageViewSet, CMSCollectionRecordViewSet

router = DefaultRouter()
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')
router.register(r'projects', WebsiteViewSet, basename='website')
router.register(r'pages', PageViewSet, basename='page')
router.register(r'cms-records', CMSCollectionRecordViewSet, basename='cms-record')

urlpatterns = [
    path('', include(router.urls)),
]
