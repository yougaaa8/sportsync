from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from cloudinary.utils import cloudinary_url
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'first_name', 'last_name'
        ]

    def validate_email(self, value):
        """Validate that email is from NUS domain"""
        if not value.endswith('@u.nus.edu'):
            raise serializers.ValidationError(
                "Please use your NUS email address (@u.nus.edu)")
        return value

    def validate(self, attrs):
        """Validate that passwords match"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        """Create new user"""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('Account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Email and password required')

        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['id', 'email', 'date_joined']

    def get_profile_picture_url(self, obj):
        """Get optimized profile picture URL from Cloudinary"""
        if obj.profile_picture:
            try:
                url, options = cloudinary_url(
                    obj.profile_picture.public_id,
                    width=300,
                    height=300,
                    crop='fill',
                    gravity='face',
                    quality='auto',
                    fetch_format='auto'
                )
                return url
            except Exception:
                return None
        return None

    def get_full_name(self, obj):
        return obj.get_full_name()


class ProfilePictureUploadSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField()

    def validate_profile_picture(self, value):
        """Validate image file"""
        # Check file size (max 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large ( > 5MB )")

        # Check file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Unsupported file type. Please upload JPG, PNG, or WebP images."
            )

        return value
