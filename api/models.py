from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings


def upload_avatar_path(instance, filename):
    '''
    プロフィール画像アップロード用のパスを生成する
    :params: instance
        プロフィールのインスタンス
    :params: filename
        ユーザーがアップロードした画像のファイル名

    :return:
        プロフィール画像アップロード用のパス
    '''
    # 拡張子を取得
    ext = filename.split('.')[-1]
    # /avatars/{ユーザーID+ニックネーム.拡張子}
    return '/'.join(['avatars', str(instance.userProfile.id)+str(instance.nickName)+str('.')+str(ext)])

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

# プロフィールモデル定義
class Profile(models.Model):
    nickName = models.CharField(max_length=20)
    # ユーザーとプロフィールを1:1で紐づける
    # ユーザーが削除されたらプロフィールも削除されるように設定
    userProfile = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name='userProfile',
        on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(black=True, null=True, upload_to=upload_avatar_path)

    def __str__(self):
        return self.nickName