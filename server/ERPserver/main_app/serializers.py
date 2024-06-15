from rest_framework import serializers
from .models import User, Supply, Sale, Inventory, Product

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']

class SupplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Supply
        fields = ['id', 'commercial_id', 'supply_date']

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = ['id', 'seller', 'sale_date']

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['id', 'name', 'description', 'owner']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'commercial_id', 'supply', 'sales', 'name', 'description', 
            'cost_price', 'sell_price', 'units', 'inventory'
        ]