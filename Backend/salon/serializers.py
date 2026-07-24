from rest_framework import serializers
from .models import ServiceCategory, Service, Specialist, SpecialistService, Customer, Booking


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class SpecialistServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialistService
        fields = '__all__'


class SpecialistSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Specialist
        fields = '__all__'
        extra_kwargs = {'password_hash': {'write_only': True}}

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        extra_kwargs = {
            'password_hash': {'write_only': True},
            'verification_token': {'write_only': True},
        }


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'