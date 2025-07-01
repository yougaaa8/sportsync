from rest_framework import serializers
from .models import Product, ProductImage, Wishlist, WishlistItem
from cca.models import CCA


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    cca_name = serializers.CharField(source='cca.name', read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = ['id', 'name', 'cca', 'cca_name', 'description', 'price',
                  'available', 'buy_link', 'created_at', 'images', 'uploaded_images']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)

        # Create product images
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)

        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])

        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Add new images if provided
        for image in uploaded_images:
            ProductImage.objects.create(product=instance, image=image)

        return instance


class ProductListSerializer(serializers.ModelSerializer):
    """Lighter serializer for product listings"""
    cca_name = serializers.CharField(source='cca.name', read_only=True)
    first_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'cca_name',
                  'price', 'available', 'first_image']

    def get_first_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return None


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'added_at']


class WishlistSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'items']

    def get_items(self, obj):
        items = WishlistItem.objects.filter(wishlist=obj).order_by('-added_at')
        return WishlistItemSerializer(items, many=True, context=self.context).data
