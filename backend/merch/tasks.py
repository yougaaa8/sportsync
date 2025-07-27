from celery import shared_task
from django.utils import timezone
from notifications.services import send_notification
from notifications.models import NotificationType
from .models import Product, WishlistItem
from cca.models import CCA, CCAMember


@shared_task
def notify_new_product(product_id, cca_id):
    """
    Celery task to notify all CCA members when a new product is created
    """
    try:
        product = Product.objects.get(id=product_id)
        cca = CCA.objects.get(id=cca_id)

        # Get all CCA members
        cca_members = CCAMember.objects.filter(cca=cca).select_related('user')

        # Send notification to each member
        for member in cca_members:
            send_notification(
                recipient=member.user,
                title=f"New {cca.name} Merchandise Available!",
                message=f"Check out the new product '{product.name}' now available for ${product.price}!",
                notification_type=NotificationType.MERCH_UPDATE,
                related_object_id=product.id,
                related_object_type='product'
            )

        return f"Sent new product notifications to {cca_members.count()} members"

    except (Product.DoesNotExist, CCA.DoesNotExist) as e:
        return f"Error: {str(e)}"


@shared_task
def notify_custom_message_to_wishlist(product_id, custom_message):
    """
    Send custom notification to users who have the product in their wishlist
    """
    try:
        product = Product.objects.get(id=product_id)
        wishlist_items = WishlistItem.objects.filter(
            product=product).select_related('wishlist__user')

        for item in wishlist_items:
            send_notification(
                recipient=item.wishlist.user,
                title=f"Update: {product.name}",
                message=custom_message,
                notification_type=NotificationType.MERCH_UPDATE,
                related_object_id=product.id,
                related_object_type='product'
            )

        return f"Sent custom notifications to {wishlist_items.count()} users"

    except Product.DoesNotExist as e:
        return f"Error: {str(e)}"
