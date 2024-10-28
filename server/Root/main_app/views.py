from rest_framework import generics
from drf_yasg.utils import swagger_auto_schema
from .models import User, Supply, Sale, Inventory, Product
from .serializers import UserSerializer, SupplySerializer, SaleSerializer, InventorySerializer, ProductSerializer
from .permissions import IsStaffOrCreatingNonStaff, IsStaffOrReadOnly
from rest_framework.exceptions import NotFound

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsStaffOrCreatingNonStaff]

    @swagger_auto_schema(tags=['user'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['user'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsStaffOrCreatingNonStaff]

    def get_object(self):
        """
        Override para buscar usuário tanto por UUID quanto por username.
        """
        # Verificar se estamos buscando pelo UUID ou pelo username
        pk = self.kwargs.get('pk')
        username = self.kwargs.get('username')

        if pk:
            # Buscar pelo UUID
            try:
                return User.objects.get(id=pk)
            except User.DoesNotExist:
                raise NotFound('User not found with this UUID.')
        
        elif username:
            # Buscar pelo username
            try:
                return User.objects.get(username=username)
            except User.DoesNotExist:
                raise NotFound('User not found with this username.')
        
        raise NotFound('No identifier provided.')

    @swagger_auto_schema(tags=['user'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(tags=['user'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(tags=['user'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @swagger_auto_schema(tags=['user'])
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)

class SupplyListCreateView(generics.ListCreateAPIView):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    permission_classes = [IsStaffOrReadOnly]

    @swagger_auto_schema(tags=['supply'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['supply'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class SupplyDestroyView(generics.DestroyAPIView):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    permission_classes = [IsStaffOrReadOnly]

    @swagger_auto_schema(tags=['supply'])
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
    
# class SupplyDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Supply.objects.all()
#     serializer_class = SupplySerializer
#     permission_classes = [IsStaffOrReadOnly]

#     @swagger_auto_schema(tags=['supply'])
#     def get(self, request, *args, **kwargs):
#         return super().get(request, *args, **kwargs)

#     @swagger_auto_schema(tags=['supply'])
#     def put(self, request, *args, **kwargs):
#         return super().put(request, *args, **kwargs)

#     @swagger_auto_schema(tags=['supply'])
#     def patch(self, request, *args, **kwargs):
#         return super().patch(request, *args, **kwargs)

#     @swagger_auto_schema(tags=['supply'])
#     def delete(self, request, *args, **kwargs):
#         return super().delete(request, *args, **kwargs)

class SaleListCreateView(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

    @swagger_auto_schema(tags=['sale'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['sale'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

    @swagger_auto_schema(tags=['sale'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['sale'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(tags=['sale'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @swagger_auto_schema(tags=['sale'])
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)

class InventoryListCreateView(generics.ListCreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsStaffOrReadOnly]

    @swagger_auto_schema(tags=['inventory'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['inventory'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class InventoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsStaffOrReadOnly]

    @swagger_auto_schema(tags=['inventory'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['inventory'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(tags=['inventory'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @swagger_auto_schema(tags=['inventory'])
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrReadOnly]

    @swagger_auto_schema(tags=['product'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['product'])
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrReadOnly]

    @swagger_auto_schema(tags=['product'])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(tags=['product'])
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(tags=['product'])
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @swagger_auto_schema(tags=['product'])
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
