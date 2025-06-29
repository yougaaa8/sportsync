from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db import transaction
from cca.models import CCAMember
from .models import Product, ProductImage, Wishlist, WishlistItem
from .serializers import ProductSerializer, ProductImageSerializer, WishlistSerializer, WishlistItemSerializer


class ProductListView(generics.ListAPIView):
    """
    GET /api/merch/products/
    List all available products
    """
    queryset = Product.objects.filter(available=True)
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveAPIView):
    """
    GET /api/merch/products/{id}/
    Get detailed information about a specific product
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductCreateView(generics.CreateAPIView):
    """
    POST /api/merch/products/
    Create a new product
    """
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        serializer.save(available=True)  # Default to available


class ProductEditView(generics.RetrieveUpdateDestroyAPIView):
    """
    PUT /api/merch/products/{id}/
    Update a specific product
    DELETE /api/merch/products/{id}/
    Delete a specific product
    """
    permission_classes = [permissions.IsAdminUser]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class WishlistItemView(generics.RetrieveDestroyAPIView):
    """
    POST /api/merch/{id}/wishlist/
    Add this product to the user's wishlist
    DELETE /api/merch/{id}/wishlist
    Remove a specific item from the user's wishlist
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WishlistItemSerializer

    def get_queryset(self):
        return WishlistItem.objects.filter(wishlist__user=self.request.user)


class WishlistView(generics.ListAPIView):
    """
    GET /api/merch/wishlist/
    List all products in the user's wishlist
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WishlistSerializer

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
