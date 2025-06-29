from cca.models import CCAMember
from rest_framework import generics, status, permissions, exceptions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Product, ProductImage, Wishlist, WishlistItem
from .serializers import ProductSerializer, ProductListSerializer, WishlistSerializer, ProductImageSerializer


class HasCCAPermission(permissions.BasePermission):
    """
    Custom permission to check if user is a committee member of the CCA
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if user is committee member of this product's CCA
        try:
            member = CCAMember.objects.get(user=request.user, cca=obj.cca)
            return member.position == 'committee'
        except CCAMember.DoesNotExist:
            return False


class ProductListView(generics.ListAPIView):
    """
    GET /api/merch/products/
    List all available products
    """
    serializer_class = ProductListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Product.objects.filter(available=True).select_related(
            'cca').prefetch_related('images')

        # Filter by CCA if provided
        cca_id = self.request.query_params.get('cca', None)
        if cca_id:
            queryset = queryset.filter(cca_id=cca_id)

        # Search by product name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )

        # Price range filtering
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset.order_by('-created_at')


class ProductDetailView(generics.RetrieveAPIView):
    """
    GET /api/merch/products/{id}/
    Get detailed information about a specific product
    """
    queryset = Product.objects.all().select_related('cca').prefetch_related('images')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProductCreateView(generics.CreateAPIView):
    """
    POST /api/merch/products/create
    Create a new product
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        cca = serializer.validated_data['cca']

        # Check if user is committee member of this CCA
        try:
            member = CCAMember.objects.get(user=self.request.user, cca=cca)
            if member.position != 'committee':
                raise exceptions.PermissionDenied(
                    "Only committee members can create products")
        except CCAMember.DoesNotExist:
            raise exceptions.PermissionDenied(
                "You are not a member of this CCA")

        serializer.save()


class ProductUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/merch/products/{id}/edit/ - Retrieve product for editing
    PUT /api/merch/products/{id}/edit/ - Update entire product
    PATCH /api/merch/products/{id}/edit/ - Partial update product
    DELETE /api/merch/products/{id}/edit/ - Delete product
    Update a specific product
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, HasCCAPermission]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_wishlist(request, product_id):
    """
    POST /api/merch/products/{id}/wishlist/
    Add this product to the user's wishlist
    """
    try:
        product = Product.objects.get(id=product_id, available=True)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found or not available'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Get or create user's wishlist
    wishlist, created = Wishlist.objects.get_or_create(user=request.user)

    # Check if product is already in wishlist
    if WishlistItem.objects.filter(wishlist=wishlist, product=product).exists():
        return Response(
            {'error': 'Product already in wishlist'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Add to wishlist
    WishlistItem.objects.create(wishlist=wishlist, product=product)

    return Response(
        {'message': 'Product added to wishlist successfully'},
        status=status.HTTP_201_CREATED
    )


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_wishlist(request, product_id):
    """
    DELETE /api/merch/products/{id}/remove-wishlist
    Remove a specific item from the user's wishlist
    """
    try:
        wishlist = Wishlist.objects.get(user=request.user)
        wishlist_item = WishlistItem.objects.get(
            wishlist=wishlist, product_id=product_id)
        wishlist_item.delete()

        return Response(
            {'message': 'Product removed from wishlist successfully'},
            status=status.HTTP_200_OK
        )
    except (Wishlist.DoesNotExist, WishlistItem.DoesNotExist):
        return Response(
            {'error': 'Product not found in wishlist'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_wishlist(request):
    """
    GET /api/merch/wishlist/
    List all products in the user's wishlists
    """
    try:
        wishlist = Wishlist.objects.get(user=request.user)
        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response(serializer.data)
    except Wishlist.DoesNotExist:
        return Response({'items': []})


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_wishlist(request):
    """
    DELETE /api/merch/{id}/wishlist/clear
    Clear user's entire wishlist
    """
    try:
        wishlist = Wishlist.objects.get(user=request.user)
        WishlistItem.objects.filter(wishlist=wishlist).delete()

        return Response(
            {'message': 'Wishlist cleared successfully'},
            status=status.HTTP_200_OK
        )
    except Wishlist.DoesNotExist:
        return Response(
            {'message': 'Wishlist was already empty'},
            status=status.HTTP_200_OK
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_product_images(request, product_id):
    """
    Add new images to an existing product (committee members only)
    """
    try:
        product = Product.objects.get(id=product_id)

        # Check permissions
        try:
            member = CCAMember.objects.get(user=request.user, cca=product.cca)
            if member.position != 'committee':
                return Response(
                    {'error': 'Only committee members can add images'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except CCAMember.DoesNotExist:
            return Response(
                {'error': 'You are not a member of this CCA'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get uploaded images from request
        images = request.FILES.getlist('images')
        if not images:
            return Response(
                {'error': 'No images provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create ProductImage objects
        created_images = []
        for image in images:
            product_image = ProductImage.objects.create(
                product=product,
                image=image,
                alt_text=request.data.get('alt_text', '')
            )
            created_images.append(ProductImageSerializer(product_image).data)

        return Response(
            {
                'message': f'{len(created_images)} images added successfully',
                'images': created_images
            },
            status=status.HTTP_201_CREATED
        )

    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated, HasCCAPermission])
def delete_product_image(request, product_id, image_id):
    """
    Delete a specific product image (committee members only)
    """
    try:
        product = Product.objects.get(id=product_id)
        image = ProductImage.objects.get(id=image_id, product=product)

        # Check permissions using the custom permission class logic
        try:
            member = CCAMember.objects.get(user=request.user, cca=product.cca)
            if member.position != 'committee':
                return Response(
                    {'error': 'Only committee members can delete images'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except CCAMember.DoesNotExist:
            return Response(
                {'error': 'You are not a member of this CCA'},
                status=status.HTTP_403_FORBIDDEN
            )

        image.delete()
        return Response(
            {'message': 'Image deleted successfully'},
            status=status.HTTP_200_OK
        )

    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except ProductImage.DoesNotExist:
        return Response(
            {'error': 'Image not found'},
            status=status.HTTP_404_NOT_FOUND
        )
