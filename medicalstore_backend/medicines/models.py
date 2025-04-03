from django.db import models
from users.models import CustomUser

class Medicine(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    stock = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'name'], name='unique_medicine_per_user')
        ]

    def __str__(self):
        return f"{self.name} - {self.user.username}"
