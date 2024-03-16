from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings

# 通常はユーザー名とパスワードで認証を行うが、メールアドレスを使いたいのでオーバーライドする
class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        '''
        ユーザーモデルのオブジェクトを作成する
        :params: email
            ユーザーが入力したメールアドレス
        :params: password
            ユーザーが入力したパスワード

        :return: user
            ユーザーのインスタンス
        '''
        if not email:
            raise ValueError('email is must')
        # ユーザーが入力したEmailアドレスを正規化
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)

        return user

    # superuserもemailを使用するようにオーバーライドしておく
    def create_superuser(self, email, password):
        '''
        管理用ユーザーモデルのオブジェクトを作成する
        :params: email
            ユーザーが入力したメールアドレス
        :params: password
            ユーザーが入力したパスワード

        :return: user
            管理用ユーザーのインスタンス
        '''
        admin_user = self.create_user(email=email, password=password)
        # 権限設定
        # https://office54.net/python/django/django-access-limit#section2
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save(using=self._db)

        return admin_user

# ユーザーモデル定義
class User(AbstractBaseUser, PermissionsMixin):
    # 同一メーアドレスのユーザーは許可しない
    email = models.EmailField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USER_FIELD = 'email'

    def __str__(self):
        return self.email