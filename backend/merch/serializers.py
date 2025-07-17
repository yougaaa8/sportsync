from rest_framework import serializers
from cloudinary.utils import cloudinary_url
from .models import Product, ProductImage, Wishlist, WishlistItem


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'alt_text', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_image_url(self, obj):
        """Get the optimized image URL"""
        if obj.image:
            try:
                url, options = cloudinary_url(
                    obj.image.public_id,
                    width=800,
                    height=800,
                    crop='fill',
                    gravity='auto',
                    quality='auto:eco',
                    fetch_format='auto',
                    background='white'
                )
                return url
            except Exception:
                return obj.image.url
        return None

    def validate_image(self, value):
        """Validate image file"""
        if not value:
            raise serializers.ValidationError("Image file is required")

        # Check file size (max 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large (max 5MB)")

        # Check file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if hasattr(value, 'content_type') and value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Unsupported file type. Please upload JPG, PNG, or WebP images."
            )

        return value


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    cca_name = serializers.CharField(source='cca.name', read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        help_text="Upload multiple images for the product"
    )
    image_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'cca', 'cca_name', 'description', 'price',
            'available', 'buy_link', 'created_at', 'images', 'uploaded_images',
            'image_count'
        ]
        read_only_fields = ['id', 'created_at']

    def get_image_count(self, obj):
        """Get the number of images for this product"""
        return obj.images.count()

    def validate_uploaded_images(self, value):
        """Validate uploaded images list"""
        if value and len(value) > 10:  # Limit to 10 images
            raise serializers.ValidationError(
                "Cannot upload more than 10 images at once")
        return value

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)

        # Create product images
        for i, image in enumerate(uploaded_images):
            ProductImage.objects.create(
                product=product,
                image=image,
                alt_text=f"Product image {i+1}"
            )

        return product

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])

        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Add new images if provided
        for i, image in enumerate(uploaded_images):
            ProductImage.objects.create(
                product=instance,
                image=image,
                alt_text=f"Product image {i+1}"
            )

        return instance


class ProductListSerializer(serializers.ModelSerializer):
    cca_name = serializers.CharField(source='cca.name', read_only=True)
    first_image = serializers.SerializerMethodField()
    image_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'cca_name', 'price', 'available',
            'first_image', 'image_count'
        ]

    def get_first_image(self, obj):
        """Get the first image URL"""
        first_image = obj.images.first()
        if first_image and first_image.image:
            try:
                # Generate optimized URL for listing
                url, options = cloudinary_url(
                    first_image.image.public_id,
                    width=400,
                    height=400,
                    crop='fill',
                    gravity='auto',
                    quality='auto:eco',
                    fetch_format='auto'
                )
                return url
            except Exception:
                return first_image.image.url
        return None

    def get_image_count(self, obj):
        """Get the number of images for this product"""
        return obj.images.count()


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'added_at']
        read_only_fields = ['id', 'added_at']


class WishlistSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'items', 'item_count', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_items(self, obj):
        """Get all wishlist items ordered by most recently added"""
        items = WishlistItem.objects.filter(wishlist=obj).order_by('-added_at')
        return WishlistItemSerializer(items, many=True, context=self.context).data

    def get_item_count(self, obj):
        """Get the total number of items in the wishlist"""
        return obj.item_count
