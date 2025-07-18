from cca.models import CCAMember
from rest_framework import generics, status, permissions, exceptions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db.models import Q
from cloudinary.uploader import upload, destroy
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
    permission_classes = []

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
    permission_classes = []


class ProductCreateView(generics.CreateAPIView):
    """
    POST /api/merch/products/create
    Create a new product
    """
    serializer_class = ProductSerializer

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
@parser_classes([MultiPartParser, FormParser])
def add_product_images(request, product_id):
    """
    POST /api/merch/products/{id}/images/
    Add new images to an existing product (committee members only)
    Supports multiple image upload
    """
    product = get_object_or_404(Product, id=product_id)

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

    # Get all uploaded images
    uploaded_images = request.FILES.getlist('images')
    alt_texts = request.POST.getlist('alt_texts')

    if not uploaded_images:
        return Response(
            {'error': 'No images provided'},
            status=status.HTTP_400_BAD_REQUEST
        )

    uploaded_results = []
    failed_uploads = []

    for i, image_file in enumerate(uploaded_images):
        try:
            # Get alt text for this image (if provided)
            alt_text = alt_texts[i] if i < len(
                alt_texts) else f"Product image {i+1}"

            # Validate image file
            serializer = ProductImageSerializer(data={
                'image': image_file,
                'alt_text': alt_text
            })

            if not serializer.is_valid():
                failed_uploads.append({
                    'image': f"image_{i+1}",
                    'errors': serializer.errors
                })
                continue

            # Generate unique public_id for Cloudinary
            public_id = f"{product.cca.name}_{product.name}_{alt_text}_{i+1}".replace(
                ' ', '_').lower()

            # Upload image to Cloudinary
            upload_result = upload(
                image_file,
                folder=f"sportsync/merch/{product.cca.name}",
                public_id=public_id,
                transformation=[
                    {'width': 800, 'height': 800, 'crop': 'fill',
                        'gravity': 'auto', 'background': 'white'},
                    {'quality': 'auto:eco'},
                    {'fetch_format': 'auto'}
                ],
                overwrite=True,
                resource_type="image"
            )

            # Create ProductImage record
            product_image = ProductImage.objects.create(
                product=product,
                image=upload_result['public_id'],
                alt_text=alt_text
            )

            uploaded_results.append({
                'id': product_image.id,
                'image_url': upload_result['secure_url'],
                'alt_text': alt_text,
                'public_id': upload_result['public_id']
            })

        except Exception as e:
            failed_uploads.append({
                'image': f"image_{i+1}",
                'error': str(e)
            })

    # Prepare response
    response_data = {
        'message': f'Successfully uploaded {len(uploaded_results)} images',
        'uploaded_images': uploaded_results
    }

    if failed_uploads:
        response_data['failed_uploads'] = failed_uploads
        response_data['message'] += f', {len(failed_uploads)} failed'

    status_code = status.HTTP_201_CREATED if uploaded_results else status.HTTP_400_BAD_REQUEST
    return Response(response_data, status=status_code)


@api_view(['GET', 'DELETE'])
def manage_product_image(request, product_id, image_id):
    """
    GET /api/merch/products/{product_id}/images/{image_id}/ - Get image info
    DELETE /api/merch/products/{product_id}/images/{image_id}/ - Delete image
    """
    try:
        product = Product.objects.get(id=product_id)
        image = ProductImage.objects.get(id=image_id, product=product)
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

    if request.method == 'GET':
        """Get image information"""
        serializer = ProductImageSerializer(
            image, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        """Delete a specific product image (committee members only)"""
        # Check permissions
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

        try:
            # Delete from Cloudinary if image exists
            if image.image:
                destroy(image.image.public_id)

            # Delete from database
            image.delete()

            return Response(
                {'message': 'Image deleted successfully'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to delete image: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
def get_product_images(request, product_id):
    """
    GET /api/merch/products/{product_id}/images/
    Get all images for a specific product
    """
    try:
        product = Product.objects.get(id=product_id)
        images = ProductImage.objects.filter(
            product=product).order_by('created_at')
        serializer = ProductImageSerializer(
            images, many=True, context={'request': request})
        return Response({
            'product_id': product_id,
            'product_name': product.name,
            'images': serializer.data,
            'total_images': len(serializer.data)
        }, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )
