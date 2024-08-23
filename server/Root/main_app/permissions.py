from rest_framework import permissions

class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
from rest_framework import permissions

class IsStaffOrCreatingNonStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            is_staff = request.data.get('is_staff', False)
            if is_staff:
                return request.user and request.user.is_authenticated and request.user.is_staff
            return True

        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method != 'POST':
            return request.user and request.user.is_authenticated
        if request.method == 'POST':
            is_staff = request.data.get('is_staff', False)
            if is_staff:
                return request.user and request.user.is_authenticated and request.user.is_staff
        return True
