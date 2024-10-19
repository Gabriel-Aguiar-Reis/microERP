from django.db import models, transaction
from django.contrib.auth.models import AbstractUser
import uuid

from django.forms import ValidationError

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


    def __str__(self):
        return f'{self.commercial_id} - {self.name}'

class SupplyProduct(models.Model):
    supply = models.ForeignKey('Supply', on_delete=models.CASCADE, related_name='supply_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.product.commercial_id} - {self.product.name} ({self.quantity})'

class Inventory(models.Model):
    class Meta:
        verbose_name_plural = 'Inventories'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255, unique=True, blank=False, editable=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False, related_name='owner_inventories')
    employers = models.ManyToManyField(User, blank=False, related_name='work_on_inventories')
    supplies = models.ManyToManyField('Supply', blank=True, related_name='supply_inventories')

    def __str__(self):
        return self.name
    
class Supply(models.Model):
    class Meta:
        verbose_name_plural = 'Supplies'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    commercial_id = models.CharField(max_length=100, blank=False, editable=True, unique=True)
    supply_date = models.DateTimeField(auto_now_add=True)
    products = models.ManyToManyField(Product, through='SupplyProduct', blank=False, related_name='supplies')
    inventory = models.ForeignKey('Inventory', on_delete=models.SET_NULL, null=True, blank=True, related_name='related_supplies')

    def delete(self, *args, **kwargs):
        with transaction.atomic():
            if self.inventory:
                supply_products = SupplyProduct.objects.filter(supply=self)
                for supply_product in supply_products:
                    inventory_products = InventoryProduct.objects.filter(
                        inventory=self.inventory,
                        product=supply_product.product
                    )

                    for inventory_product in inventory_products:
                        if inventory_product.quantity < supply_product.quantity:
                            raise ValidationError(message=f"Não é possível deletar o fornecimento {self.commercial_id}. "
                                f"O produto {supply_product.product.name} foi alterado no inventário para uma quantidade menor do que a fornecida.",
                                code='401'
                            )
                        elif inventory_product.quantity == supply_product.quantity:
                            inventory_product.delete()
                        else:
                            inventory_product.quantity -= supply_product.quantity
                            inventory_product.save()

            super(Supply, self).delete(*args, **kwargs)
            
    def __str__(self):
        return self.commercial_id


class InventoryProduct(models.Model):
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='inventory_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.product.commercial_id} - {self.product.name} ({self.quantity})'

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
    payment_method = models.CharField(max_length=30, blank=False)

    def __str__(self):
        return f'({self.sale_date}) {self.seller}'