from django.contrib import admin

from .models import Inventory, InventoryProduct, Product, Sale, SaleProduct, Supply, User

admin.site.register([Inventory, Product, Sale, Supply, User, SaleProduct, InventoryProduct])