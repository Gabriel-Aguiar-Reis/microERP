from rest_framework import serializers
from .models import (
    InventoryProduct,
    User,
    Supply,
    Sale,
    Inventory,
    Product,
    SaleProduct,
    SupplyProduct
)

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'commercial_id', 'name', 'description', 'cost_price', 'sell_price']

class SupplyProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    quantity = serializers.IntegerField()

    class Meta:
        model = SupplyProduct
        fields = ['product', 'product_id', 'quantity']

    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        product = Product.objects.get(id=product_id)
        supply_product = SupplyProduct.objects.create(product=product, **validated_data)
        return supply_product

class SupplySerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    products = SupplyProductSerializer(many=True, write_only=True)
    products_details = SupplyProductSerializer(source='supply_products', many=True, read_only=True)  # Usando o novo related_name

    class Meta:
        model = Supply
        fields = ['id', 'commercial_id', 'supply_date', 'products', 'products_details']

    def create(self, validated_data):
        products_data = validated_data.pop('products')
        supply = Supply.objects.create(**validated_data)
        
        for product_data in products_data:
            product_id = product_data['product_id']
            quantity = product_data['quantity']
            product = Product.objects.get(id=product_id)
            SupplyProduct.objects.create(supply=supply, product=product, quantity=quantity)
        
        return supply

class SaleProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    quantity = serializers.IntegerField()

    class Meta:
        model = SaleProduct
        fields = ['product', 'product_id', 'quantity']

    def create(self, validated_data):
        product_id = validated_data.pop('product_id')
        product = Product.objects.get(id=product_id)
        sale_product = SaleProduct.objects.create(product=product, **validated_data)
        return sale_product

class SaleSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    products = SaleProductSerializer(many=True, write_only=True)
    products_details = SaleProductSerializer(source='saleproduct_set', many=True, read_only=True)

    class Meta:
        model = Sale
        fields = ['id', 'seller', 'inventory', 'sale_date', 'products', 'products_details', 'payment_method']

    def validate(self, data):
        inventory = self.instance.inventory if self.instance else data.get('inventory')
        seller = self.instance.seller if self.instance else data.get('seller')
        products_data = data.get('products', [])

        if seller.work_on != inventory:
            raise serializers.ValidationError("Vendedor não está associado a este estoque.")

        for product_data in products_data:
            product = Product.objects.get(id=product_data['product_id'])
            try:
                inventory_product = InventoryProduct.objects.get(inventory=inventory, product=product)
            except InventoryProduct.DoesNotExist:
                raise serializers.ValidationError(f"O produto {product.name} não está disponível no estoque.")

            if inventory_product.quantity < product_data['quantity']:
                raise serializers.ValidationError(f"Quantidade insuficiente do produto {product.name} no estoque.")
            elif product_data['quantity'] == 0:
                raise serializers.ValidationError(f"Quantidade do produto {product.name} não pode ser 0.")
        return data

    def update(self, instance, validated_data):
        products_data = validated_data.pop('products', None)
        inventory = instance.inventory

        if products_data:
            for product_data in products_data:
                product = Product.objects.get(id=product_data['product_id'])
                quantity_to_deduct = product_data['quantity']

                try:
                    inventory_product = InventoryProduct.objects.get(inventory=inventory, product=product)
                except InventoryProduct.DoesNotExist:
                    raise serializers.ValidationError(f"O produto {product.name} não está disponível no estoque.")

                existing_sale_product = SaleProduct.objects.filter(sale=instance, product=product).first()
                if existing_sale_product:
                    if inventory_product.quantity + existing_sale_product.quantity < quantity_to_deduct:
                        raise serializers.ValidationError(f"Quantidade insuficiente do produto {product.name} no estoque.")
                    
                    inventory_product.quantity += existing_sale_product.quantity
                    inventory_product.quantity -= quantity_to_deduct
                    inventory_product.save()

                    existing_sale_product.quantity = quantity_to_deduct
                    existing_sale_product.save()

                    if inventory_product.quantity == 0:
                        inventory_product.delete()
                else:
                    if inventory_product.quantity < quantity_to_deduct:
                        raise serializers.ValidationError(f"Quantidade insuficiente do produto {product.name} no estoque.")

                    inventory_product.quantity -= quantity_to_deduct
                    inventory_product.save()

                    SaleProduct.objects.create(
                        sale=instance,
                        product=product,
                        quantity=quantity_to_deduct
                    )

                    if inventory_product.quantity == 0:
                        inventory_product.delete()

        instance.save()
        return instance

    def create(self, validated_data):
        products_data = validated_data.pop('products')
        sale = Sale.objects.create(**validated_data)
        inventory = validated_data['inventory']

        for product_data in products_data:
            product = Product.objects.get(id=product_data['product_id'])
            quantity_to_deduct = product_data['quantity']

            try:
                inventory_product = InventoryProduct.objects.get(inventory=inventory, product=product)
            except InventoryProduct.DoesNotExist:
                raise serializers.ValidationError(f"O produto {product.name} não está disponível no estoque.")

            if inventory_product.quantity >= quantity_to_deduct:
                inventory_product.quantity -= quantity_to_deduct
                inventory_product.save()

                SaleProduct.objects.create(
                    sale=sale, 
                    product=product, 
                    quantity=quantity_to_deduct
                )

                if inventory_product.quantity == 0:
                    inventory_product.delete()

        return sale

class UserSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    password = serializers.CharField(write_only=True)
    is_staff = serializers.BooleanField(required=False)
    sales = SaleSerializer(many=True, read_only=True)
    work_on = serializers.PrimaryKeyRelatedField(queryset=Inventory.objects.all(), required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'is_staff', 'sales', 'work_on']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ""),
            last_name=validated_data.get('last_name', ""),
            is_staff=validated_data.get('is_staff', False),
            work_on=validated_data.get('work_on', None)
        )
        user.set_password(validated_data['password'])
        user.save()
        inventory = validated_data.get('work_on')
        if inventory:
            inventory.employers.add(user)
        return user

    def update(self, instance, validated_data):
        old_inventory = instance.work_on
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        password = validated_data.get('password', None)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.work_on = validated_data.get('work_on', instance.work_on) 
        if password:
            instance.set_password(password)    
        instance.save()
        new_inventory = validated_data.get('work_on')
        if old_inventory and old_inventory != new_inventory:
            old_inventory.employers.remove(instance)
        if new_inventory and instance not in new_inventory.employers.all():
            new_inventory.employers.add(instance)
        return instance

class InventoryProductDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = InventoryProduct
        fields = ['product', 'quantity']

class InventorySerializer(serializers.ModelSerializer):
    supplies = SupplySerializer(many=True, read_only=True)
    employers = UserSerializer(many=True, read_only=True)
    supply_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True, required=False
    )
    inventory_products_details = InventoryProductDetailSerializer(source='inventory_products', many=True, read_only=True)

    class Meta:
        model = Inventory
        fields = ['id', 'name', 'description', 'owner', 'supplies', 'supply_ids', 'employers', 'inventory_products_details']

    def update(self, instance, validated_data):
        supply_ids = validated_data.pop('supply_ids', [])

        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.owner = validated_data.get('owner', instance.owner)
        instance.save()

        for supply_id in supply_ids:
            try:
                supply = Supply.objects.get(id=supply_id)
            except Supply.DoesNotExist:
                raise serializers.ValidationError(f"O fornecimento com id {supply_id} não existe.")
            
            if supply not in instance.supplies.all():
                instance.supplies.add(supply)
                supply.inventory = instance
                supply.save()

                supply_products = SupplyProduct.objects.filter(supply=supply)
                for supply_product in supply_products:
                    product = supply_product.product
                    quantity = supply_product.quantity

                    inventory_product, created = InventoryProduct.objects.get_or_create(
                        inventory=instance,
                        product=product,
                        defaults={'quantity': quantity}
                    )
                    if not created:
                        inventory_product.quantity += quantity
                        inventory_product.save()

        return instance