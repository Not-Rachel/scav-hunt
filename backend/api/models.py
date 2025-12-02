from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profilePhotos/', null=False, default="http://localhost:8000/media/userPhotos/Colvill_honse.jpg")

    def __str__(self):
        return f"{self.user.username} Profile"


class Scavpost(models.Model):
    found_item = models.CharField(default="UNKNOWN")
    taxon_id = models.IntegerField(null=True)
    title = models.CharField(max_length=100)
    content = models.TextField(null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="scavposts")
    image = models.ImageField(upload_to='userPhotos/', null=False, default="http://localhost:8000/media/userPhotos/Colvill_honse.jpg")

    def __str__(self):
        return self.title
    
class DailyNaturalist(models.Model):
    date = models.DateField()
    # lat = models.FloatField(default=0.0)
    # lng = models.FloatField(default=0.0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="naturalist_items")
    data = models.JSONField()

    class Meta:
        unique_together = ("date","user") 

    def __str__(self):
        return f"Naturalist item for {self.date}"