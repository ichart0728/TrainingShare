from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext as _
from . import models


# Userモデルをカスタマイズしているので、Userモデルに対応するようにUserAdminをオーバーライド
class UserAdmin(BaseUserAdmin):
    ordering = ['id']
    list_display = ['email']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ()}),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                )
            }
        ),
        (_('Important dates'), {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')
        }),
    )

# ダッシュボードにモデルを登録
admin.site.register(models.User, UserAdmin)
admin.site.register(models.Profile)
admin.site.register(models.Post)
admin.site.register(models.Comment)
admin.site.register(models.BodyPart)
admin.site.register(models.TrainingMenu)
admin.site.register(models.TrainingRecord)
