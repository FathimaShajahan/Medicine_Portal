from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Medicine
from .serializers import MedicineSerializer

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def medicine_list_create(request):
    if request.method == "POST":
        # Check if the user already has 5 medicines
        if Medicine.objects.filter(user=request.user).count() >= 5:
            return Response({"error": "You can only add up to 5 medicines."}, status=400)

        serializer = MedicineSerializer(data=request.data, context={"request": request})  # Pass request context
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    # If it's a GET request, return medicines for the authenticated user
    medicines = Medicine.objects.filter(user=request.user)
    serializer = MedicineSerializer(medicines, many=True)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated]) 
def delete_medicine(request, medicine_id):
    try:
        # Find the medicine by ID and ensure it belongs to the authenticated user
        medicine = Medicine.objects.get(id=medicine_id, user=request.user)
        medicine.delete()
        return Response({"message": "Medicine deleted successfully"}, status=204)
    except Medicine.DoesNotExist:
        return Response({"error": "Medicine not found"}, status=404)

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_medicine(request, medicine_id):
    try:
        medicine = Medicine.objects.get(id=medicine_id, user=request.user)  # Ensure the medicine belongs to the user
    except Medicine.DoesNotExist:
        return Response({"error": "Medicine not found"}, status=404)

    serializer = MedicineSerializer(medicine, data=request.data, partial=True)  # `partial=True` allows partial updates
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)
