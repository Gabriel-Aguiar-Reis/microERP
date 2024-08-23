from rest_framework import generics
from .models import User, Supply, Sale, Inventory, Product
from .serializers import UserSerializer, SupplySerializer, SaleSerializer, InventorySerializer, ProductSerializer
from .permissions import IsStaffOrCreatingNonStaff, IsStaffOrReadOnly

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsStaffOrCreatingNonStaff]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsStaffOrCreatingNonStaff]

class SupplyListCreateView(generics.ListCreateAPIView):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    permission_classes = [IsStaffOrReadOnly]

# class SupplyDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Supply.objects.all()
#     serializer_class = SupplySerializer
#     permission_classes = [IsStaffOrReadOnly]

class SupplyDestroyView(generics.DestroyAPIView):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    permission_classes = [IsStaffOrReadOnly]

class SaleListCreateView(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class InventoryListCreateView(generics.ListCreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsStaffOrReadOnly]

class InventoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsStaffOrReadOnly]

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrReadOnly]

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrReadOnly]
