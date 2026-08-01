import requests
from decouple import config
from django.shortcuts import render
import secrets
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view
from rest_framework.response import Response


from rest_framework import viewsets
from .models import ServiceCategory, Service, Specialist, SpecialistService, Customer, Booking
from .serializers import (
    ServiceCategorySerializer, ServiceSerializer, SpecialistSerializer,
    SpecialistServiceSerializer, CustomerSerializer, BookingSerializer
)


class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class SpecialistViewSet(viewsets.ModelViewSet):
    queryset = Specialist.objects.all()
    serializer_class = SpecialistSerializer


class SpecialistServiceViewSet(viewsets.ModelViewSet):
    queryset = SpecialistService.objects.all()
    serializer_class = SpecialistServiceSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
def send_verification_email(full_name, email, token):
    verify_url = f"{config('BACKEND_URL', default='http://127.0.0.1:8000')}/api/auth/verify/{token}/"
    payload = {
        "sender": {"name": "LUXE Salon & Spa", "email": config('DEFAULT_FROM_EMAIL')},
        "to": [{"email": email, "name": full_name}],
        "subject": "Verify your LUXE account",
        "htmlContent": (
            f"<p>Hi {full_name},</p>"
            f"<p>Please verify your email by clicking this link:</p>"
            f"<p><a href='{verify_url}'>{verify_url}</a></p>"
            f"<p>If you did not create this account, you can ignore this email.</p>"
        ),
    }
    headers = {
        "accept": "application/json",
        "api-key": config('BREVO_API_KEY'),
        "content-type": "application/json",
    }
    try:
        requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers, timeout=10)
    except requests.RequestException as e:
        print(f"Failed to send verification email: {e}")
@api_view(['POST'])
def customer_register(request):
    data = request.data
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not full_name or not email or not password:
        return Response({'detail': 'full_name, email and password are required.'}, status=400)
    if len(password) < 6:
        return Response({'detail': 'Password must be at least 6 characters.'}, status=400)
    if Customer.objects.filter(email__iexact=email).exists():
        return Response({'detail': 'An account with this email already exists.'}, status=400)

    token = secrets.token_urlsafe(32)
    customer = Customer.objects.create(
        full_name=full_name,
        email=email,
        password_hash=make_password(password),
        phone=data.get('phone', ''),
        verification_token=token,
    )

    send_verification_email(full_name, email, token)

    return Response(CustomerSerializer(customer).data, status=201)

@api_view(['POST'])
def customer_login(request):
    data = request.data
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    try:
        customer = Customer.objects.get(email__iexact=email)
    except Customer.DoesNotExist:
        return Response({'detail': 'Invalid email or password.'}, status=400)

    if not check_password(password, customer.password_hash):
        return Response({'detail': 'Invalid email or password.'}, status=400)

    if not customer.is_verified:
        return Response({'detail': 'Please verify your email before logging in. Check your inbox.'}, status=403)

    return Response(CustomerSerializer(customer).data, status=200)

@api_view(['GET'])
def customer_verify_email(request, token):
    try:
        customer = Customer.objects.get(verification_token=token)
    except Customer.DoesNotExist:
        return Response({'detail': 'Invalid or expired verification link.'}, status=400)

    customer.is_verified = True
    customer.verification_token = ''
    customer.save()
    return Response({'detail': 'Email verified successfully. You can now log in.'})
@api_view(['POST'])
def specialist_login(request):
    # Plaintext comparison — matches the decision to skip full auth for barbers.
    data = request.data
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    try:
        specialist = Specialist.objects.get(email__iexact=email)
    except Specialist.DoesNotExist:
        return Response({'detail': 'Invalid email or password.'}, status=400)

    if specialist.password_hash != password:
        return Response({'detail': 'Invalid email or password.'}, status=400)

    return Response(SpecialistSerializer(specialist).data, status=200)