from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    
    def __str__(self):
        if self.is_staff:
            return f'|STAFF| {self.get_username()}'
        else:
            return f'|SELLER| {self.get_username()}'

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    commercial_id = models.CharField(max_length=100, blank=False, editable=True, unique=False)
    name = models.CharField(max_length=255, unique=False, blank=False, editable=True)
    description = models.TextField(blank=True)
    cost_price = models.FloatField(default=0, blank=True, editable=True)
    sell_price = models.FloatField(default=0, blank=True, editable=True)
    units = models.IntegerField(default=0, blank=True, editable=True)
    
    def __str__(self):
        return f'<{self.name}> {self.commercial_id}'
    
class Supply(models.Model):
    class Meta:
        verbose_name_plural = 'Supplies'
        
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    commercial_id = models.CharField(max_length=100, blank=False, editable=True, unique=True)
    supply_date = models.DateField(auto_now_add=True)
    products = models.ManyToManyField(Product, blank=False, related_name='supplies')
    
    def __str__(self):
        return f'<{self.commercial_id}> {self.supply_date}'
    
class Inventory(models.Model):
    class Meta:
        verbose_name_plural = 'Inventories'
        
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255, unique=True, blank=False, editable=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, related_name='inventories')
    products = models.ManyToManyField(Product, through='InventoryProduct', related_name='inventories')
    
    def __str__(self):
        return f'<{self.name}> {self.owner}'

class InventoryProduct(models.Model):
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

class SaleProduct(models.Model):
    sale = models.ForeignKey('Sale', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

class Sale(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, related_name='sales')
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, blank=False, null=False, related_name='sales')
    sale_date = models.DateField(auto_now_add=True)
    products = models.ManyToManyField(Product, through=SaleProduct, related_name='sales')
    
    def __str__(self):
        return f'<{self.seller.get_full_name()}> {self.sale_date}'
