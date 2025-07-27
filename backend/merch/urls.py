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

    # Product Image URLs
    path('products/<int:product_id>/images/',
         views.add_product_images, name='add-product-images'),
    path('products/<int:product_id>/images/list/',
         views.get_product_images, name='get-product-images'),
    path('products/<int:product_id>/images/<int:image_id>/',
         views.manage_product_image, name='manage-product-image'),

    # Wishlist URLs
    path('products/<int:product_id>/wishlist/',
         views.add_to_wishlist, name='add-to-wishlist'),
    path('products/<int:product_id>/remove-wishlist/',
         views.remove_from_wishlist, name='remove-from-wishlist'),
    path('products/<int:product_id>/notify-wishlist/',
         views.notify_wishlist_users, name='notify-wishlist-users'),
    path('wishlist/', views.get_wishlist, name='get-wishlist'),
    path('wishlist/clear/', views.clear_wishlist, name='clear-wishlist'),
]
