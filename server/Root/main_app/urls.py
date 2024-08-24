from django.urls import path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication

from .views import (
    SupplyDestroyView, UserListCreateView, UserDetailView,
    SupplyListCreateView, # SupplyDetailView,
    SaleListCreateView, SaleDetailView,
    InventoryListCreateView, InventoryDetailView,
    ProductListCreateView, ProductDetailView
)

schema_view = get_schema_view(
   openapi.Info(
      title="microERP API",
      default_version='v1',
      description="This is microERP API swagger.",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="lugafeagre@gmail.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
   authentication_classes=[SessionAuthentication, BasicAuthentication, TokenAuthentication],
)

urlpatterns = [
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('supplies/', SupplyListCreateView.as_view(), name='supply-list-create'),
    path('supplies/<uuid:pk>/', SupplyDestroyView.as_view(), name='supply-destroy'),
    path('sales/', SaleListCreateView.as_view(), name='sale-list-create'),
    path('sales/<uuid:pk>/', SaleDetailView.as_view(), name='sale-detail'),
    path('inventories/', InventoryListCreateView.as_view(), name='inventory-list-create'),
    path('inventories/<uuid:pk>/', InventoryDetailView.as_view(), name='inventory-detail'),
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<uuid:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Swagger
    path('<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]