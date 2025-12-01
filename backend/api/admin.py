from django.contrib import admin

# Register your models here.
from .models import Scavpost

@admin.register(Scavpost)
class ScavpostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'found_item', 'created_at')
    search_fields = ('title', 'content', 'author__username')
    list_filter = ('created_at', 'found_item')