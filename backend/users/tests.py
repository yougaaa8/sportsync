from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer

User = get_user_model()


class CustomUserManagerTests(TestCase):
    def test_create_user(self):
        email = 'test@u.nus.edu'
        password = 'testpassword'
        user = User.objects.create_user(
            email=email,
            password=password
        )
        self.assertIsInstance(user, User)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        email = 'test@u.nus.edu'
        password = 'testpassword'
        user = User.objects.create_superuser(
            email=email,
            password=password
        )
        self.assertIsInstance(user, User)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_create_user_without_email(self):
        with self.assertRaises(ValueError) as context:
            User.objects.create_user(email="", password="testpass123")
        self.assertEqual(str(context.exception), "The Email field must be set")


class UserModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@u.nus.edu',
            password='testpassword',
            first_name='Test',
            last_name='User'
        )

    def test_user_str(self):
        self.assertEqual(str(self.user), 'test@u.nus.edu')

    def test_user_full_name(self):
        self.assertEqual(self.user.get_full_name(), 'Test User')

    def test_user_default_values(self):
        self.assertIsNotNone(self.user.date_joined)
        self.assertEqual(self.user.bio, '')
        self.assertEqual(self.user.telegram_handle, '')
        self.assertIsNone(self.user.profile_picture)
        self.assertEqual(self.user.status, 'student')
        self.assertEqual(self.user.emergency_contact, '')


class UserRegistrationSerializerTests(TestCase):
    def test_valid_data(self):
        data = {
            'email': 'test@u.nus.edu',
            'password': 'testpassword',
            'password_confirm': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User'
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_email(self):
        data = {
            'email': 'test@gmail.com',
            'password': 'testpassword',
            'password_confirm': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User'
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_password_mismatch(self):
        data = {
            'email': 'test@u.nus.edu',
            'password': 'testpassword',
            'password_confirm': 'differentpassword',
            'first_name': 'Test',
            'last_name': 'User'
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Passwords don't match",
                      serializer.errors['non_field_errors'])


class UserLoginSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@u.nus.edu',
            password='testpassword'
        )

    def test_valid_login(self):
        data = {
            'email': 'test@u.nus.edu',
            'password': 'testpassword'
        }
        serializer = UserLoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['email'], self.user.email)
        self.assertEqual(
            serializer.validated_data['password'], data['password'])

    def test_wrong_password(self):
        data = {
            'email': 'test@u.nus.edu',
            'password': 'wrongpassword'
        }
        serializer = UserLoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('Invalid credentials',
                      serializer.errors['non_field_errors'])

    def test_nonexistent_user(self):
        data = {
            'email': 'nonexistent@u.nus.edu',
            'password': 'testpassword'
        }
        serializer = UserLoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)

    def test_missing_email(self):
        data = {
            'email': '',
            'password': 'testpassword'
        }
        serializer = UserLoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('This field may not be blank.',
                      serializer.errors['email'])

    def test_missing_password(self):
        data = {
            'email': 'test@u.nus.edu',
            'password': ''
        }
        serializer = UserLoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('This field may not be blank.',
                      serializer.errors['password'])


class UserProfileSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@u.nus.edu',
            password='testpassword'
        )

    def test_serialize_user_profile(self):
        serializer = UserProfileSerializer(self.user)
        data = serializer.data
        self.assertEqual(data['bio'], '')
        self.assertEqual(data['telegram_handle'], '')
        self.assertIsNone(data['profile_picture'])
        self.assertEqual(data['status'], 'student')
        self.assertEqual(data['emergency_contact'], '')


class AuthenticationViewsTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')

    def test_user_registration_success(self):
        data = {
            'email': 'test@u.nus.edu',
            'password': 'strongpass123',
            'password_confirm': 'strongpass123',
            'first_name': 'John',
            'last_name': 'Doe'
        }

        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])

    def test_user_registration_invalid_data(self):
        data = {
            'email': 'test@gmail.com',
            'password': 'weak',
            'password_confirm': 'different',
            'first_name': 'John',
            'last_name': 'Doe'
        }

        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        user = User.objects.create_user(
            email='test@u.nus.edu',
            password='testpass123'
        )

        data = {
            'email': 'test@u.nus.edu',
            'password': 'testpass123'
        }

        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)

    def test_user_login_invalid_credentials(self):
        data = {
            'email': 'test@u.nus.edu',
            'password': 'wrongpass'
        }

        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_logout_success(self):
        user = User.objects.create_user(
            email='test@u.nus.edu',
            password='testpass123'
        )
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        data = {'refresh_token': str(refresh)}

        response = self.client.post(self.logout_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_user_logout_no_token(self):
        user = User.objects.create_user(
            email='test@u.nus.edu',
            password='testpass123'
        )
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        response = self.client.post(self.logout_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_user_logout_unauthenticated(self):
        response = self.client.post(
            self.logout_url, {'refresh_token': 'some_token'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileViewsTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@u.nus.edu',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )
        self.client.force_authenticate(user=self.user)

        self.profile_url = reverse('profile')
        self.update_profile_url = reverse('update_profile')
        self.upload_picture_url = reverse('upload_profile_picture')
        self.delete_picture_url = reverse('delete_profile_picture')

    def test_get_profile_success(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@u.nus.edu')

    def test_get_profile_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile_success(self):
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'bio': 'Updated bio'
        }

        response = self.client.put(self.update_profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Jane')
        self.assertEqual(self.user.bio, 'Updated bio')

    def test_partial_update_profile(self):
        data = {'bio': 'Just updating bio'}

        response = self.client.patch(self.update_profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.bio, 'Just updating bio')
        self.assertEqual(self.user.first_name, 'John')


class GetUserByEmailViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@u.nus.edu',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )
        self.url = reverse('get_user_profile_by_email')

    def test_get_user_by_email_success(self):
        response = self.client.get(self.url, {'email': 'test@u.nus.edu'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@u.nus.edu')
        self.assertEqual(response.data['full_name'], 'John Doe')
        self.assertIn('user_id', response.data)
        self.assertIn('cca_ids', response.data)

    def test_get_user_by_email_not_found(self):
        response = self.client.get(
            self.url, {'email': 'nonexistent@u.nus.edu'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

    def test_get_user_by_email_missing_parameter(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)


class IntegrationTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_complete_user_flow(self):
        # 1. Register user
        register_data = {
            'email': 'integration@u.nus.edu',
            'password': 'strongpass123',
            'password_confirm': 'strongpass123',
            'first_name': 'Integration',
            'last_name': 'Test'
        }

        register_response = self.client.post(
            reverse('register'), register_data)
        self.assertEqual(register_response.status_code,
                         status.HTTP_201_CREATED)

        # 2. Login user
        login_data = {
            'email': 'integration@u.nus.edu',
            'password': 'strongpass123'
        }

        login_response = self.client.post(reverse('login'), login_data)
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

        tokens = login_response.data['tokens']

        # 3. Access protected profile endpoint
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')
        profile_response = self.client.get(reverse('profile'))
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)

        # 4. Update profile
        update_data = {
            'bio': 'Integration test bio',
            'telegram_handle': '@integration_test'
        }

        update_response = self.client.patch(
            reverse('update_profile'), update_data)
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)

        # 5. Logout user
        logout_data = {'refresh_token': tokens['refresh']}
        logout_response = self.client.post(reverse('logout'), logout_data)
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        # 6. Verify access is denied after logout
        self.client.credentials()
        profile_response_after_logout = self.client.get(reverse('profile'))
        self.assertEqual(profile_response_after_logout.status_code,
                         status.HTTP_401_UNAUTHORIZED)
