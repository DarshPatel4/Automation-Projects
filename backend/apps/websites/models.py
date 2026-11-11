import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Workspace(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workspaces', null=True, blank=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, default='Folder')
    color = models.CharField(max_length=50, default='#6366f1')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Website(models.Model):
    SITE_TYPE_CHOICES = (
        ('static', 'Static View-Only (Jamstack / No DB)'),
        ('dynamic', 'Dynamic Responsive (With Inbuilt Database & CMS)'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='websites', null=True, blank=True)
    workspace = models.ForeignKey(Workspace, on_delete=models.SET_NULL, null=True, blank=True, related_name='websites')
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    site_type = models.CharField(max_length=20, choices=SITE_TYPE_CHOICES, default='static')
    subdomain = models.CharField(max_length=100, unique=True)
    custom_domain = models.CharField(max_length=255, null=True, blank=True)
    theme_config = models.JSONField(default=dict, blank=True)
    
    # Inbuilt / External Database Configuration (for dynamic sites)
    db_config = models.JSONField(
        default=dict,
        blank=True,
        help_text="Database settings: engine (sqlite/postgres), host, db_name, ssl, connection_status"
    )
    collections_schema = models.JSONField(
        default=list,
        blank=True,
        help_text="Custom collections schema defined in CMS (e.g. leads, posts, products)"
    )
    storage_usage_bytes = models.BigIntegerField(default=1024 * 50)  # Default ~50KB base payload

    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.name} [{self.site_type}] ({self.subdomain})"


class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name='pages')
    title = models.CharField(max_length=255)
    slug = models.CharField(max_length=255)
    is_home = models.BooleanField(default=False)
    root_node_id = models.CharField(max_length=100, default='root')
    nodes = models.JSONField(default=dict)
    seo_title = models.CharField(max_length=255, blank=True, default='')
    seo_description = models.TextField(blank=True, default='')
    custom_css = models.TextField(blank=True, default='')
    custom_head_script = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['is_home', 'created_at']
        unique_together = ('website', 'slug')

    def __str__(self):
        return f"{self.website.name} - {self.title} ({self.slug})"


class CMSCollectionRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name='cms_records')
    collection_name = models.CharField(max_length=100)
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.website.name} - {self.collection_name} ({self.id})"
