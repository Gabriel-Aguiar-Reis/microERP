from django.contrib import admin
from django.urls import path, include, re_path
from main_app import urls as main_app_urls
from django.views.generic import RedirectView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(main_app_urls)),
    re_path(r'^$', RedirectView.as_view(url='/api/', permanent=False)),
    re_path(r'^.*$', RedirectView.as_view(url='/api/', permanent=False)),
]
