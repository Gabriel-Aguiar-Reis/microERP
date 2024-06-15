from rest_framework import generics
from .models import User, Supply, Sale, Inventory, Product
from .serializers import UserSerializer, SupplySerializer, SaleSerializer, InventorySerializer, ProductSerializer

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        is_staff = self.request.data.get('is_staff', False)
        serializer.save(is_staff=is_staff)

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def perform_update(self, serializer):
        is_staff = self.request.data.get('is_staff', serializer.instance.is_staff)
        serializer.save(is_staff=is_staff)

class SupplyListCreateView(generics.ListCreateAPIView):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer

class SupplyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer

class SaleListCreateView(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class InventoryListCreateView(generics.ListCreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class InventoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
