from decimal import Decimal
from django.db import models


class ServiceCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'service_category'

    def __str__(self):
        return self.name


class Service(models.Model):
    category = models.ForeignKey(
        ServiceCategory, on_delete=models.RESTRICT, related_name='services'
    )
    name = models.CharField(max_length=100)
    duration_minutes = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'service'

    def __str__(self):
        return self.name


class Specialist(models.Model):
    full_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    work_start = models.TimeField()
    work_end = models.TimeField()
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=Decimal('5.0'))
    joined_at = models.DateTimeField(auto_now_add=True)
    services = models.ManyToManyField(
        Service, through='SpecialistService', related_name='specialists'
    )

    class Meta:
        db_table = 'specialist'

    def __str__(self):
        return self.full_name


class SpecialistService(models.Model):
    specialist = models.ForeignKey(Specialist, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    class Meta:
        db_table = 'specialist_service'
        constraints = [
            models.UniqueConstraint(fields=['specialist', 'service'], name='specialist_service_unique')
        ]

    def __str__(self):
        return f"{self.specialist} → {self.service}"


class Customer(models.Model):
    full_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=64, blank=True, null=True)

    class Meta:
        db_table = 'customer'

    def __str__(self):
        return self.full_name


class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.RESTRICT, related_name='bookings')
    specialist = models.ForeignKey(Specialist, on_delete=models.RESTRICT, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.RESTRICT, related_name='bookings')
    booking_date = models.DateField()
    start_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'booking'
        indexes = [
            models.Index(fields=['specialist', 'booking_date'], name='idx_booking_specialist_date'),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(status__in=['Pending', 'Confirmed', 'Completed', 'Cancelled']),
                name='booking_status_check',
            ),
        ]

    def __str__(self):
        return f"{self.customer} - {self.service} on {self.booking_date}"