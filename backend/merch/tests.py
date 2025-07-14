from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal

from .models import Product, ProductImage, Wishlist, WishlistItem
from .serializers import ProductSerializer, ProductListSerializer, WishlistSerializer
from cca.models import CCA, CCAMember

User = get_user_model()


class ProductModelTest(TestCase):
    def setUp(self):
        self.cca = CCA.objects.create(
            name='Test CCA',
            description='Test Description'
        )
        self.product = Product.objects.create(
            name='Test Product',
            cca=self.cca,
            description='Test Description',
            price=Decimal('19.99'),
            buy_link='https://example.com/buy'
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, 'Test Product')
        self.assertEqual(self.product.cca, self.cca)
        self.assertEqual(self.product.price, Decimal('19.99'))
        self.assertTrue(self.product.available)

    def test_product_str_representation(self):
        expected = f"{self.product.name} ({self.cca.name})"
        self.assertEqual(str(self.product), expected)


class WishlistModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.cca = CCA.objects.create(
            name='Test CCA',
            description='Test Description'
        )
        self.product = Product.objects.create(
            name='Test Product',
            cca=self.cca,
            description='Test Description',
            price=Decimal('19.99'),
            buy_link='https://example.com/buy'
        )
        self.wishlist = Wishlist.objects.create(user=self.user)

    def test_wishlist_creation(self):
        self.assertEqual(self.wishlist.user, self.user)

    def test_wishlist_item_creation(self):
        wishlist_item = WishlistItem.objects.create(
            wishlist=self.wishlist,
            product=self.product
        )
        self.assertEqual(wishlist_item.wishlist, self.wishlist)
        self.assertEqual(wishlist_item.product, self.product)


class ProductSerializerTest(TestCase):
    def setUp(self):
        self.cca = CCA.objects.create(
            name='Test CCA',
            description='Test Description'
        )
        self.product = Product.objects.create(
            name='Test Product',
            cca=self.cca,
            description='Test Description',
            price=Decimal('19.99'),
            buy_link='https://example.com/buy'
        )

    def test_product_serializer(self):
        serializer = ProductSerializer(self.product)
        data = serializer.data
        self.assertEqual(data['name'], 'Test Product')
        self.assertEqual(data['cca_name'], 'Test CCA')
        self.assertEqual(data['price'], '19.99')

    def test_product_list_serializer(self):
        serializer = ProductListSerializer(self.product)
        data = serializer.data
        self.assertEqual(data['name'], 'Test Product')
        self.assertEqual(data['cca_name'], 'Test CCA')
        self.assertIn('first_image', data)


class ProductAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.committee_user = User.objects.create_user(
            email='committee@example.com',
            password='testpass123'
        )
        self.cca = CCA.objects.create(
            name='Test CCA',
            description='Test Description'
        )
        CCAMember.objects.create(
            user=self.user,
            cca=self.cca,
            position='member'
        )
        CCAMember.objects.create(
            user=self.committee_user,
            cca=self.cca,
            position='committee'
        )
        self.product = Product.objects.create(
            name='Test Product',
            cca=self.cca,
            description='Test Description',
            price=Decimal('19.99'),
            buy_link='https://example.com/buy'
        )

    def test_product_list_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_product_list_unauthenticated(self):
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_product_detail(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('product-detail', kwargs={'pk': self.product.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Product')

    def test_product_create_committee(self):
        self.client.force_authenticate(user=self.committee_user)
        url = reverse('product-create')
        data = {
            'name': 'New Product',
            'cca': self.cca.id,
            'description': 'New Description',
            'price': '29.99',
            'buy_link': 'https://example.com/new'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_product_create_non_committee(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('product-create')
        data = {
            'name': 'New Product',
            'cca': self.cca.id,
            'description': 'New Description',
            'price': '29.99',
            'buy_link': 'https://example.com/new'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class WishlistAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.cca = CCA.objects.create(
            name='Test CCA',
            description='Test Description'
        )
        self.product = Product.objects.create(
            name='Test Product',
            cca=self.cca,
            description='Test Description',
            price=Decimal('19.99'),
            buy_link='https://example.com/buy'
        )

    def test_add_to_wishlist(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('add-to-wishlist',
                      kwargs={'product_id': self.product.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            WishlistItem.objects.filter(
                wishlist__user=self.user,
                product=self.product
            ).exists()
        )

    def test_remove_from_wishlist(self):
        self.client.force_authenticate(user=self.user)
        wishlist = Wishlist.objects.create(user=self.user)
        WishlistItem.objects.create(wishlist=wishlist, product=self.product)

        url = reverse('remove-from-wishlist',
                      kwargs={'product_id': self.product.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_wishlist(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('get-wishlist')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_clear_wishlist(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('clear-wishlist')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
