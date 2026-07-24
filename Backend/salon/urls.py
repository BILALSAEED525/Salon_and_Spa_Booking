from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceCategoryViewSet, ServiceViewSet, SpecialistViewSet,
    SpecialistServiceViewSet, CustomerViewSet, BookingViewSet,
    customer_register, customer_login, customer_verify_email,
    specialist_login,
)
router = DefaultRouter()
router.register('service-categories', ServiceCategoryViewSet)
router.register('services', ServiceViewSet)
router.register('specialists', SpecialistViewSet)
router.register('specialist-services', SpecialistServiceViewSet)
router.register('customers', CustomerViewSet)
router.register('bookings', BookingViewSet)

urlpatterns = router.urls + [
    path('auth/register/', customer_register, name='customer-register'),
    path('auth/login/', customer_login, name='customer-login'),
    path('auth/verify/<str:token>/', customer_verify_email, name='customer-verify'),
    path('auth/specialist-login/', specialist_login, name='specialist-login'),
]