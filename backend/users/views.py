from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from cloudinary.uploader import upload, destroy
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, ProfilePictureUploadSerializer
from .models import User


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User registered successfully',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def profile(request):
    """Get user profile"""
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
def update_profile(request):
    """Update user profile"""
    serializer = UserProfileSerializer(
        request.user,
        data=request.data,
        partial=request.method == 'PATCH'
    )
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_profile_picture(request):
    """Upload/update user profile picture to Cloudinary"""
    serializer = ProfilePictureUploadSerializer(data=request.data)

    if serializer.is_valid():
        try:
            user = request.user
            image_file = serializer.validated_data['profile_picture']

            # Delete old profile picture if exists
            if user.profile_picture:
                user.delete_old_profile_picture()
            public_id = f"{user.email.replace('@', '_at_').replace('.', '_')}_profile_picture"
            # Upload new image to Cloudinary
            upload_result = upload(
                image_file,
                folder="sportsync/profiles/",
                public_id=public_id,
                transformation=[
                    {'width': 300, 'height': 300, 'crop': 'fill', 'gravity': 'face'},
                    {'quality': 'auto'},
                    {'fetch_format': 'auto'}
                ],
                overwrite=True,
                resource_type="image"
            )

            # Update user profile picture field
            user.profile_picture = upload_result['public_id']
            user.save()

            return Response({
                'message': 'Profile picture uploaded successfully',
                'profile_picture_url': upload_result['secure_url'],
                'user': UserProfileSerializer(user).data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Upload failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_profile_picture(request):
    """Delete user profile picture"""
    try:
        user = request.user
        if user.profile_picture:
            # Delete from Cloudinary
            user.delete_old_profile_picture()
            # Clear the field
            user.profile_picture = None
            user.save()

            return Response({
                'message': 'Profile picture deleted successfully',
                'user': UserProfileSerializer(user).data
            })
        else:
            return Response({
                'message': 'No profile picture to delete'
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'error': f'Delete failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def logout(request):
    """Logout user by blacklisting refresh token"""
    try:
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({
                'error': 'Refresh token required'
            }, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user_by_email(request):
    """
    Get user information by email address
    Usage: GET /api/get-user-profile/?email=user@example.com
    """
    email = request.GET.get('email')

    if not email:
        return Response({
            'error': 'Email parameter is required'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)

        # Get list of CCA IDs that the user is linked to
        cca_ids = list(user.ccamember_set.values_list('cca_id', flat=True))

        return Response({
            'user_id': user.id,
            'email': user.email,
            'full_name': user.get_full_name(),
            'first_name': user.first_name,
            'last_name': user.last_name,
            'status': user.status,
            'emergency_contact': user.emergency_contact,
            'profile_picture_url': UserProfileSerializer(user).data['profile_picture_url'],
            'cca_ids': cca_ids
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
