

# Register your models here.
from django.contrib import admin
from .models import ServiceCategory, Service, Specialist, SpecialistService, Customer, Booking

admin.site.register(ServiceCategory)
admin.site.register(Service)
admin.site.register(Specialist)
admin.site.register(SpecialistService)
admin.site.register(Customer)
admin.site.register(Booking)