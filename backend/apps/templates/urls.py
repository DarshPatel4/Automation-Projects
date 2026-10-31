from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TemplateViewSet, TemplateCategoryViewSet

router = DefaultRouter()
router.register(r'marketplace', TemplateViewSet, basename='template')
router.register(r'categories', TemplateCategoryViewSet, basename='template-category')

urlpatterns = [
    path('', include(router.urls)),
]
