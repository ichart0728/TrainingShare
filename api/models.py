from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
import uuid


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
    # ファイル名をユーザーIDに変更
    return f'avatars/{instance.user.id}.{ext}'

def upload_post_path(instance, filename):
    '''
    投稿画像用のパスを生成する
    :params: instance
        投稿のインスタンス
    :params: filename
        ユーザーがアップロードした画像のファイル名

    :return:
        プロフィール画像アップロード用のパス
    '''
    # 拡張子を取得
    ext = filename.split('.')[-1]
    # ファイル名をユーザーIDとタイトルに変更
    return f'posts/{instance.userPost.id}_{instance.title}.{ext}'


# 通常はユーザー名とパスワードで認証を行うが、メールアドレスを使いたいのでオーバーライドする
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        '''
        ユーザーモデルのオブジェクトを作成する
        :params: email
            ユーザーが入力したメールアドレス
        :params: password
            ユーザーが入力したパスワード

        :return: user
            ユーザーのインスタンス
        '''
        # emailがない場合はエラーを返す
        if not email:
            raise ValueError('email is must')
        # ユーザーが入力したEmailアドレスを正規化
        user = self.model(email=self.normalize_email(email), **extra_fields)
        # パスワードをハッシュ化
        user.set_password(password)
        # ユーザーモデルを保存
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
        # ユーザーモデルを作成
        admin_user = self.create_user(email=email, password=password)
        # 権限設定
        # https://office54.net/python/django/django-access-limit#section2
        admin_user.is_staff = True
        # スーパーユーザー権限を付与
        admin_user.is_superuser = True
        # ユーザーモデルを保存
        admin_user.save(using=self._db)

        return admin_user

# ユーザーテーブル (User) のモデル
class User(AbstractBaseUser, PermissionsMixin):
    # ユーザーID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # メールアドレス
    email = models.EmailField(max_length=254, unique=True)
    # ユーザーがアクティブかどうか
    is_active = models.BooleanField(default=True)
    # ユーザーがスタッフかどうか
    is_staff = models.BooleanField(default=False)
    # ユーザーがスーパーユーザーかどうか
    objects = UserManager()
    # メールアドレスをユーザー名として使用
    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

# プロフィールテーブル (Profile) のモデル
class Profile(models.Model):
    # プロフィールID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # ニックネーム
    nickName = models.CharField(max_length=20)
    # ユーザーとプロフィールを1:1で紐づける
    # ユーザーが削除されたらプロフィールも削除されるように設定
    userProfile = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name='userProfile',
        on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    # プロフィール画像
    img = models.ImageField(blank=True, null=True, upload_to=upload_avatar_path)

    def __str__(self):
        return self.nickName


# 投稿テーブル (Post) のモデル
class Post(models.Model):
    # 投稿ID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # タイトル
    title = models.CharField(max_length=100)
    # ユーザーとプ投稿を1:Nで紐づける
    # ユーザーが削除されたら投稿も削除されるように設定
    userPost = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='userPost',
        on_delete=models.CASCADE
    )
    # 投稿作成日時
    created_on = models.DateTimeField(auto_now_add=True)
    # 投稿画像
    img = models.ImageField(blank=True, null=True, upload_to=upload_post_path)
    # いいねしたユーザー
    liked = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked', blank=True)

    def __str__(self):
        return self.title

# コメントテーブル (Comment) のモデル
class Comment(models.Model):
    # コメントID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # コメント内容
    text = models.CharField(max_length=100)
    # ユーザーとコメントを1:Nで紐づける
    userComment = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='userComment',
        on_delete=models.CASCADE
    )
    # 投稿とコメントを1:Nで紐づける
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return self.text

# 部位カテゴリーテーブル (BodyPart) のモデル
class BodyPart(models.Model):
    # 部位カテゴリーID
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

from django.db import models

# トレーニングメニューテーブル (TrainingMenu) のモデル
class TrainingMenu(models.Model):
    # トレーニングメニューID
    name = models.CharField(max_length=100)
    # 部位カテゴリーとトレーニングメニューを1:Nで紐づける
    body_part = models.ForeignKey('BodyPart', on_delete=models.CASCADE, related_name='training_menus')

    def __str__(self):
        return f"{self.name} ({self.body_part.name})"

# トレーニングセッションテーブル (TrainingSession) のモデル
class TrainingSession(models.Model):
    # ユーザーID
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # トレーニング日
    date = models.DateField()
    # トレーニング時間
    duration = models.DurationField()

    # def __str__(self):
    #     return f"{self.user.username} - {self.date}"

# トレーニング記録テーブル (TrainingRecord) のモデル
class TrainingRecord(models.Model):
    # トレーニング記録ID
    session = models.ForeignKey(TrainingSession, related_name='workouts', on_delete=models.CASCADE)
    # トレーニングメニュー
    menu = models.ForeignKey(TrainingMenu, on_delete=models.CASCADE, related_name='workouts')
    # トレーニング部位
    body_part = models.ForeignKey(BodyPart, on_delete=models.CASCADE, null=True, blank=True)  # 新たに追加

    def __str__(self):
        return f"{self.session.user.username} - {self.menu.name} on {self.session.date}"

# トレーニングセットテーブル (TrainingSet) のモデル
class TrainingSet(models.Model):
    record = models.ForeignKey(TrainingRecord, on_delete=models.CASCADE, related_name='sets')
    # セット番号
    set_number = models.IntegerField()
    # このセットでの重量
    weight = models.FloatField()
    # このセットでのレップ数
    reps = models.IntegerField()
    # このセットが完了したかどうか
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Set {self.set_number} of {self.record}"
