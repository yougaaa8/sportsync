from django.contrib import admin
from .models import Product, ProductImage, Wishlist, WishlistItem

# Register your models here.
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(Wishlist)
admin.site.register(WishlistItem)
