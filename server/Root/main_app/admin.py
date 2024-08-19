from django import forms
from django.contrib import admin
from .models import (
    Inventory, 
    InventoryProduct, 
    Product, 
    Sale, 
    SaleProduct, 
    Supply, 
    User
)

admin.site.register([SaleProduct, InventoryProduct])

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('commercial_id', 'name', 'cost_price', 'sell_price')
    search_fields = ('commercial_id', 'name')

class SaleProductInline(admin.TabularInline):
    model = SaleProduct
    extra = 1
    autocomplete_fields = ['product']

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('seller', 'sale_date')
    inlines = [SaleProductInline]

class InventoryProductInline(admin.TabularInline):
    model = InventoryProduct
    extra = 1
    autocomplete_fields = ['product']

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner')
    inlines = [InventoryProductInline]

@admin.register(Supply)
class SupplyAdmin(admin.ModelAdmin):
    list_display = ('commercial_id', 'supply_date')
