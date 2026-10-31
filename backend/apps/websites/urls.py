from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WebsiteViewSet, PageViewSet

router = DefaultRouter()
router.register(r'projects', WebsiteViewSet, basename='website')
router.register(r'pages', PageViewSet, basename='page')

urlpatterns = [
    path('', include(router.urls)),
]
