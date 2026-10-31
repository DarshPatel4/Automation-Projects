from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/websites/', include('apps.websites.urls')),
    path('api/templates/', include('apps.templates.urls')),
    path('api/ai/', include('apps.ai_generator.urls')),
]
