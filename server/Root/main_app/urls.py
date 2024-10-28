from django.urls import path

from .views import (
    SupplyDestroyView, UserListCreateView, UserDetailView,
    SupplyListCreateView, # SupplyDetailView,
    SaleListCreateView, SaleDetailView,
    InventoryListCreateView, InventoryDetailView,
    ProductListCreateView, ProductDetailView
)

urlpatterns = [
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<uuid:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/username/<str:username>/', UserDetailView.as_view(), name='user-detail-username'),
    path('supplies/', SupplyListCreateView.as_view(), name='supply-list-create'),
    path('supplies/<uuid:pk>/', SupplyDestroyView.as_view(), name='supply-destroy'),
    path('sales/', SaleListCreateView.as_view(), name='sale-list-create'),
    path('sales/<uuid:pk>/', SaleDetailView.as_view(), name='sale-detail'),
    path('inventories/', InventoryListCreateView.as_view(), name='inventory-list-create'),
    path('inventories/<uuid:pk>/', InventoryDetailView.as_view(), name='inventory-detail'),
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<uuid:pk>/', ProductDetailView.as_view(), name='product-detail'),
]