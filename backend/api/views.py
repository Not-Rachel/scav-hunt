from django.contrib.auth.models import User
# from requests import Response
from rest_framework import generics
from .serializers import UserSerializer, ScavpostSerializer, DailyNaturalistSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.generics import CreateAPIView
from .models import Scavpost, DailyNaturalist
from .utils import get_daily_naturalist
from rest_framework.response import Response
from rest_framework.views import APIView


class DailyNaturalistView(APIView):
    def get(self, request):
        obj = get_daily_naturalist(request)
        serializer = DailyNaturalistSerializer(obj)
        return Response(serializer.data)


class ScavpostListCreate(generics.ListCreateAPIView):
    serializer_class = ScavpostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        query_type = self.request.query_params.get('type')
        # query_species = self.request.query_params.get('species')
        # query_taxa = self.request.query_params.get('taxa')
        # query_user = self.request.query_params.get('user_id')
        if query_type == "filter":
            return Scavpost.objects.filter(author=user)
        elif query_type == "exclude":
            return Scavpost.objects.exclude(author=user)
        else:
            return Scavpost.objects.all()


    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class ScavpostDelete(generics.DestroyAPIView):
    serializer_class=ScavpostSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Scavpost.objects.filter(author=user)
    
class ScavpostUpdate(generics.UpdateAPIView):
    serializer_class=ScavpostSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Scavpost.objects.filter(author=user)
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]