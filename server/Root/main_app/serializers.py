from rest_framework import serializers
from .models import User, Supply, Sale, Inventory, Product
from django.contrib.auth import get_user_model

User = get_user_model()

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    class Meta:
        model = Product
        fields = [
            'id', 'commercial_id', 'supply', 'sales', 'name', 'description', 
            'cost_price', 'sell_price', 'units', 'inventory'
        ]
        
class InventorySerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    products = ProductSerializer(many=True, read_only=False)
    class Meta:
        model = Inventory
        fields = ['id', 'name', 'description', 'owner', 'products']
        
class SaleSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    products = ProductSerializer(many=True, read_only=False)
    class Meta:
        model = Sale
        fields = ['id', 'seller', 'sale_date', 'products']
        
class SupplySerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    products = ProductSerializer(many=True, read_only=False)
    class Meta:
        model = Supply
        fields = ['id', 'commercial_id', 'supply_date', 'products']
        
class UserSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    password = serializers.CharField(write_only=True)
    is_staff = serializers.BooleanField(required=False)
    sales = SaleSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'is_staff', 'sales']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_staff=validated_data.get('is_staff', False),
            sales=validated_data['sales']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        password = validated_data.get('password', None)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.sales = validated_data.get('sales', instance.sales)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
