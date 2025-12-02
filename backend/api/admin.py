from django.contrib import admin

# Register your models here.
from .models import Scavpost, DailyNaturalist

@admin.register(Scavpost)
class ScavpostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'found_item', 'created_at')
    search_fields = ('title', 'content', 'author__username')
    list_filter = ('created_at', 'found_item')

@admin.register(DailyNaturalist)
class DailyNaturalistAdmin(admin.ModelAdmin):
    list_display = ("date",)         
    search_fields = ("date",)         
    ordering = ("-date",)            
