from django.contrib import admin

from .models import Inventory, Product, Sale, Supply, User

admin.site.register([Inventory, Product, Sale, Supply, User])