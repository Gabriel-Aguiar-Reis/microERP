from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from main_app import urls as main_app_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(main_app_urls)),
    re_path(r'^$', RedirectView.as_view(url='/api/', permanent=False)),
    re_path(r'^.*$', RedirectView.as_view(url='/api/', permanent=False)),

    # Rotas JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
