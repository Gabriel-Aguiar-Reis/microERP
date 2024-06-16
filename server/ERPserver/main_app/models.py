import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    
    def __str__(self):
        if self.is_staff == True:
            return f'|STAFF| {self.get_username()}'
        else:
            return f'|SELLER| {self.get_username()}'

class Supply(models.Model):
    class Meta:
        verbose_name_plural = 'Supplies'
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    commercial_id = models.CharField(max_length=100, blank=False, editable=True, unique=True)
    supply_date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f'<{self.commercial_id}> {self.supply_date}'

class Sale(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, related_name='sales')
    sale_date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f'<{self.seller.get_full_name()}> {self.sale_date}'
    
class Inventory(models.Model):
    class Meta:
        verbose_name_plural = 'Inventories'
        
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255, unique=True, blank=False, editable=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, related_name='inventories')
    
    def __str__(self):
        return f'<{self.name}> {self.owner}'

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    commercial_id = models.CharField(max_length=100, blank=False, editable=True, unique=False)
    supply = models.ForeignKey(Supply, on_delete=models.CASCADE, blank=False, null=False, related_name='products')
    sales = models.ManyToManyField(Sale, blank=True, related_name='products')
    name = models.CharField(max_length=255, unique=False, blank=False, editable=True)
    description = models.TextField(blank=True)
    cost_price = models.FloatField(default=0, blank=True, editable=True)
    sell_price = models.FloatField(default=0, blank=True, editable=True)
    units = models.IntegerField(default=0, blank=True, editable=True)
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, blank=False, null=False, related_name='products')
    
    def __str__(self):
        return f'<{self.name}> {self.supply.commercial_id}'