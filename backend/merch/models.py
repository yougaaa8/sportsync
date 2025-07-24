from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField
from cloudinary.uploader import destroy
from django.core.validators import MinValueValidator


class Product(models.Model):
    name = models.CharField(max_length=255)
    cca = models.ForeignKey('cca.CCA', on_delete=models.CASCADE,
                            related_name='products')
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0.00)])
    available = models.BooleanField(default=True)
    buy_link = models.URLField(help_text="Link to buy the product")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.cca.name})"

    def delete(self, *args, **kwargs):
        # Delete all associated images from Cloudinary when product is deleted
        for image in self.images.all():
            if image.image:
                try:
                    destroy(image.image.public_id)
                except Exception:
                    pass
        super().delete(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField(
        'image',
        transformation={
            'width': 800,
            'height': 800,
            'crop': 'fill',
            'gravity': 'auto',
            'quality': 'auto:eco',
            'fetch_format': 'auto',
            'background': 'white'
        },
        help_text="Upload a product image"
    )
    alt_text = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Image for {self.product.name}"

    def delete(self, *args, **kwargs):
        # Delete image from Cloudinary when model instance is deleted
        if self.image:
            try:
                destroy(self.image.public_id)
            except Exception:
                pass
        super().delete(*args, **kwargs)

    @property
    def image_url(self):
        if self.image:
            return self.image.url
        return None


class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='WishlistItem')

    def __str__(self):
        return f"Wishlist of {self.user.get_full_name()}"


class WishlistItem(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['wishlist', 'product']
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.product.name} in {self.wishlist.user.get_full_name()}'s wishlist"
