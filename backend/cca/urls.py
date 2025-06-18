from django.urls import path
from . import views

urlpatterns = [
    path('<int:id>/', views.cca_detail_view, name='cca_detail'),
]
