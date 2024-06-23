from rest_framework import permissions

class IsStaffOrCreatingNonStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method == 'POST' and 'is_staff' in request.data:
            if request.data['is_staff'] == True or request.data['is_staff'] == 'true':
                return request.user and request.user.is_staff
        return True
