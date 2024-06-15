from django.contrib import admin
from django.urls import path, include
from ERPserver import main_app

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(main_app.urls))
]
