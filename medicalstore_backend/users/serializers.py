from django.contrib.auth import get_user_model
from rest_framework import serializers

from users.models import CustomUser

User = CustomUser # Use get_user_model instead of direct import

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User  # Use the dynamically retrieved model
        fields = ["username", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
