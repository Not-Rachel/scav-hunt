from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Scavpost, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password':{'write_only':True}} #Do not return password

    def create(self, validated_data):
            password = validated_data.pop('password')
            user = User.objects.create_user(password=password, **validated_data)
            return user

    # def create(self, validated_data):
    #     user = User.objects.create_user(**validated_data)   
    #     return user

class ScavpostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    class Meta:
        model = Scavpost
        fields = ['id', 'found_item', 'title', 'content', 'created_at', 'author', 'author_username', 'latitude', 'longitude', 'image', "taxon_id"]
        extra_kwargs = {'author':{'read_only':True}}

class ProfileSerializer(serializers.ModelSerializer):
     
    class Meta:
        model = Profile
        fields = ['user','image']
        extra_kwargs = {'user':{'read_only':True}}
