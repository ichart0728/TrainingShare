from rest_framework import generics
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from . import serializers
from .models import Profile, Post, Comment, BodyPart, TrainingMenu, TrainingRecord, TrainingSession
from rest_framework.exceptions import ValidationError

# 新規ユーザー作成用View
class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    # 新規ユーザー作成時はJWT認証を回避する必要があるのでAllowAnyを指定
    # NOTE: AllowAnyの後に , を付けないとなぜかエラーになるので削除不可
    permission_classes = (AllowAny,)

# プロフィールの新規作成、更新用View
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    # クライアント側からはuserProfileを指定しなくていいようにしているので、サーバー側で指定するようにオーバーライドする
    def perform_create(self, serializer):
        '''
        ログインしているユーザーを識別して、シリアライザーに設定する
        :params: serializer
            プロフィール用のシリアライザー
        '''
        serializer.save(userProfile=self.request.user)

# ログインユーザーのプロフィールを表示するためのView
class MyProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    def get_queryset(self):
        '''
        ログインしているユーザーのプロフィールを返す
        '''
        return self.queryset.filter(userProfile=self.request.user)

# 指定したUserのプロフィールを表示するためのView
class ProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    def get_queryset(self):
        '''
        指定したUserのプロフィールを返す
        '''
        return self.queryset.filter(userProfile=self.kwargs['user_id'])

# 投稿作成用のView
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer

    def perform_create(self, serializer):
        '''
        ログインしているユーザーの投稿を作成する
        :params: serializer
            投稿用のシリアライザー
        '''
        serializer.save(userPost=self.request.user)

# 指定したUserの投稿一覧
class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer

    def get_queryset(self):
        '''
        指定したUserの投稿一覧を返す
        '''
        return self.queryset.filter(userPost=self.kwargs['user_id'])

# コメント作成用のView
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer

    def perform_create(self, serializer):
        '''
        ログインしているユーザーのコメントを作成する
        :params: serializer
            コメント用のシリアライザー
        '''
        serializer.save(userComment=self.request.user)

# BodyPartテーブルとトレーニングメニューテーブルを結合して表示するためのView
class BodyPartWithMenusView(generics.ListAPIView):
    queryset = BodyPart.objects.all()
    serializer_class = serializers.BodyPartSerializer

    def get_queryset(self):
        # トレーニングメニューを取得するためにprefetch_relatedを使用
        return self.queryset.prefetch_related('training_menus')

# トレーニング記録テーブル (TrainingRecord) のView
class TrainingRecordViewSet(viewsets.ModelViewSet):
    queryset = TrainingRecord.objects.all()
    serializer_class = serializers.TrainingRecordSerializer

    def perform_create(self, serializer):
        # クライアントからセッションIDを受け取る
        session_id = self.request.data.get('session_id')
        try:
            # セッションIDからセッションインスタンスを取得
            session = TrainingSession.objects.get(id=session_id)
        except TrainingSession.DoesNotExist:
            raise ValidationError('指定されたセッションが存在しません。')

        # セッションに紐づけて保存
        serializer.save(session=session)

# 指定したUserのトレーニング記録を表示するためのView
class TrainingRecordListView(generics.ListAPIView):
    serializer_class = serializers.TrainingRecordSerializer

    def get_queryset(self):
        '''
        指定したUserのトレーニング記録を返す
        '''
        user_id = self.kwargs['user_id']  # URLからユーザーIDを取得
        user_sessions = TrainingSession.objects.filter(user_id=user_id)  # ユーザーのトレーニングセッションを取得
        return TrainingRecord.objects.filter(session__in=user_sessions)  # そのセッションに関連する記録をフィルター

# トレーニングセッションテーブル (TrainingSession) のView
class TrainingSessionViewSet(viewsets.ModelViewSet):
    queryset = TrainingSession.objects.all()
    serializer_class = serializers.TrainingSessionSerializer

    def perform_create(self, serializer):
        # ログインユーザーをセッションのユーザーとして設定
        serializer.save(user=self.request.user)