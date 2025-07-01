from django.urls import path
from . import views

urlpatterns = [
    # Product URLs
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/create/', views.ProductCreateView.as_view(),
         name='product-create'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(),
         name='product-detail'),
    path('products/<int:pk>/edit/',
         views.ProductUpdateView.as_view(), name='product-update'),
    path('products/<int:product_id>/images/',
         views.add_product_images, name='add-product-images'),
    path('products/<int:product_id>/image/<int:image_id>/',
         views.delete_product_image, name='delete-product-image'),

    # Wishlist URLs
    path('products/<int:product_id>/wishlist/',
         views.add_to_wishlist, name='add-to-wishlist'),
    path('products/<int:product_id>/remove-wishlist/',
         views.remove_from_wishlist, name='remove-from-wishlist'),
    path('wishlist/', views.get_wishlist, name='get-wishlist'),
    path('wishlist/clear/', views.clear_wishlist, name='clear-wishlist'),
]
