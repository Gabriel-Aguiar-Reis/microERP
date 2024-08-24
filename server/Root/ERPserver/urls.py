from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication

from main_app import urls as main_app_urls

schema_view = get_schema_view(
    openapi.Info(
        title="microERP API",
        default_version='v1',
        description="This is microERP API swagger.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="lugafeagre@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=[SessionAuthentication, BasicAuthentication, TokenAuthentication],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(main_app_urls)),
    re_path(r'^$', RedirectView.as_view(url='/swagger/', permanent=False)),

    # Rotas JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Swagger
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('swagger/<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]