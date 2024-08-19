from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    work_on = models.ForeignKey('Inventory', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    commercial_id = models.CharField(max_length=100, blank=False, editable=True, unique=False)
    name = models.CharField(max_length=255, unique=False, blank=False, editable=True)
    description = models.TextField(blank=True)
    cost_price = models.FloatField(default=0, blank=True, editable=True)
    sell_price = models.FloatField(default=0, blank=True, editable=True)
    units = models.IntegerField(default=0, blank=True, editable=True)

    def __str__(self):
        return f'{self.commercial_id} - {self.name}'
    
class Supply(models.Model):
    class Meta:
        verbose_name_plural = 'Supplies'
        
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    commercial_id = models.CharField(max_length=100, blank=False, editable=True, unique=True)
    supply_date = models.DateTimeField(auto_now_add=True)
    products = models.ManyToManyField(Product, blank=False, related_name='supplies')
    
class Inventory(models.Model):
    class Meta:
        verbose_name_plural = 'Inventories'
        
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255, unique=True, blank=False, editable=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, related_name='inventories')
    products = models.ManyToManyField(Product, through='InventoryProduct', related_name='inventories')
    employers = models.ManyToManyField(User, blank=False, related_name='work_on_inventories')

    def __str__(self):
        return self.name
        

class InventoryProduct(models.Model):
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    
    def __str__(self):
        return f'{self.product.commercial_id} - {self.product.name}'

class SaleProduct(models.Model):
    sale = models.ForeignKey('Sale', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    
    def __str__(self):
        return f'{self.product.commercial_id} - {self.product.name}'
class Sale(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, related_name='sales')
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, blank=False, null=False, related_name='sales')
    sale_date = models.DateTimeField(auto_now_add=True)
    products = models.ManyToManyField(Product, through=SaleProduct, related_name='sales')

    def __str__(self):
        return f'({self.sale_date}) {self.seller}'