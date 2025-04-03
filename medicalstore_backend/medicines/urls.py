from django.urls import path
from .views import medicine_list_create, delete_medicine, update_medicine

urlpatterns = [
    path("medicines/", medicine_list_create, name="medicine-list-create"),
    path("medicines/<int:medicine_id>/", update_medicine, name="update-medicine"),  # New update endpoint
    path("medicines/<int:medicine_id>/delete/", delete_medicine, name="delete-medicine"),
]
