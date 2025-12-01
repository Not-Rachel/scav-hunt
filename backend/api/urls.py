from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("scavposts/", views.ScavpostListCreate.as_view(), name='scavpost-list'),
    path("scavpost/delete/<int:pk>/", views.ScavpostDelete.as_view(), name="delete-scavpost"),
    path("scavpost/update/<int:pk>/", views.ScavpostUpdate.as_view(), name="update-scavpost"),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) # TODO: Replace with real storage

