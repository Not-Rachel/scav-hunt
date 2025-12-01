from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ScavpostSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.generics import CreateAPIView
from .models import Scavpost

class ScavpostListCreate(generics.ListCreateAPIView):
    serializer_class = ScavpostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        query_type = self.request.query_params.get('type')
        query_species = self.request.query_params.get('species')
        query_taxa = self.request.query_params.get('taxa')
        query_user = self.request.query_params.get('user_id')
        if query_type == "filter":
            return Scavpost.objects.filter(author=user)
        elif query_type == "exclude":
            return Scavpost.objects.exclude(author=user)
        else:
            return Scavpost.objects.all()
    # TODO: Get all posts on a species
    # TODO: Get all posts on in an area
    # TODO: Get all posts on an a taxa
    # TODO: Get all posts from a user


    
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