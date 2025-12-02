
from django.utils import timezone

from django.http import JsonResponse
import requests
from .models import DailyNaturalist


def get_daily_naturalist(request, test_date=None):
    today = test_date or  timezone.now().date()
    user = request.user

    #Call api every day
    obj, created = DailyNaturalist.objects.get_or_create(date=today,user=user, defaults={'data': {}})

    if created or not obj.data:
        lat = request.GET.get("lat") #-117.609137
        lng = request.GET.get("lng") #33.654474
        query = request.GET.get("query", "")

        URL = f"https://api.inaturalist.org/v1/observations/species_counts?lat={lat}&lng={lng}&radius=1&per_page=12&{query}"
        print(URL)
        response = requests.get(URL)
        data = response.json()
        obj.data = data
        # obj.lat = lat
        # obj.lng = lng
        obj.save()
    return obj
        # print(data)
        # return JsonResponse(data)

