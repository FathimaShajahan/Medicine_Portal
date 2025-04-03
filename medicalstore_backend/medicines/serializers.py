from rest_framework import serializers
from medicines.models import Medicine

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ['id', 'name', 'stock', 'user', 'created_at']
        read_only_fields = ['user', 'created_at']  # Prevent user & created_at from being manually set

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user  # Assign the authenticated user
        return super().create(validated_data)
