"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def about_view(request):
    """Simple about page endpoint"""
    return JsonResponse({
        'name': 'SportsSync',
        'description': 'A centralized digital platform platform that makes sports activities at NUS more organized and accessible.',
        'version': '1.0.0',
        'team': 'SportsSync Team: Alex (Y1 CS) and Yoga (Y1 EE)',
        'features': [
            'User Authentication & Profile Management',
            'Open Matchmaking',
            'CCA Dashboard',
            'Tournament Information',
            'Event Management',
            'Merchandise Shop'
        ]
    })


urlpatterns = [
    path('', about_view, name='about'),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/cca/', include('cca.urls')),
    path('api/matchmaking/', include('matchmaking.urls')),
    path('api/tournament/', include('tournament.urls')),
    path('api/event/', include('event.urls')),
    path('api/merch/', include('merch.urls')),
]
