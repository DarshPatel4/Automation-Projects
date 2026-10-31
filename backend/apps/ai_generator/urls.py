from django.urls import path
from .views import AISynthesizeSectionView

urlpatterns = [
    path('synthesize/', AISynthesizeSectionView.as_view(), name='ai-synthesize'),
]

