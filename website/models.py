from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class MediaUpload(models.Model):

    file_status_list = (
        (1, "active"),
        (0, "inactive")
    )

    uploader = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.TextField(max_length=255, null=False, default='')
    description = models.TextField(null=True)
    file_name = models.CharField(max_length=255, null=True)
    file_extension = models.CharField(max_length=30, null=True)
    file_type = models.TextField(null=True)
    file_size = models.CharField(max_length=255, null=True)
    file_path = models.TextField(null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    file_status = models.IntegerField(choices=file_status_list, default=1)
