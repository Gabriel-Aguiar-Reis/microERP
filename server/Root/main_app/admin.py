from django.contrib import admin
from .models import (
    Inventory, 
    Product, 
    Sale, 
    SaleProduct, 
    Supply,
    SupplyProduct, 
    User
)

admin.site.register([SaleProduct, SupplyProduct])

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

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner')


    def has_add_permission(self, request, obj=None):
        return request.user.is_staff

class SupplyProductInline(admin.TabularInline):
    model = SupplyProduct
    extra = 1
    autocomplete_fields = ['product']

@admin.register(Supply)
class SupplyAdmin(admin.ModelAdmin):
    list_display = ('commercial_id', 'supply_date')
    inlines = [SupplyProductInline]

    def has_add_permission(self, request, obj=None):
        return request.user.is_staff