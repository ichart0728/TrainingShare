from rest_framework import generics
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
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
    """
    BodyPartテーブルとTrainingMenuテーブルを結合して表示するためのView
    """
    queryset = BodyPart.objects.all().prefetch_related('training_menus')
    serializer_class = serializers.BodyPartSerializer
    def get_queryset(self):
        # トレーニングメニューを取得するためにprefetch_relatedを使用
        return self.queryset.prefetch_related('training_menus')

# トレーニングセッションテーブル (TrainingSession) のView
class TrainingSessionViewSet(viewsets.ModelViewSet):
    """
    トレーニングセッションのCRUDを行うためのView
    """
    queryset = TrainingSession.objects.all()
    serializer_class = serializers.TrainingSessionSerializer

    def create(self, request, *args, **kwargs):
        print("Creating a new training session with data: %s", request.data)
        # トレーニングセッションデータを含むリクエストデータの処理
        session_serializer = self.get_serializer(data=request.data)
        print("session_serializer: %s", session_serializer)

        session_serializer.is_valid(raise_exception=True)
        self.perform_create(session_serializer)
        print("perform_created!")

        session = session_serializer.save()
        headers = self.get_success_headers(session_serializer.data)

        # レスポンスに新しく作成されたセッションのIDを含む
        session_id = session_serializer.data['id']
        return Response(session_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        # ユーザー情報をセッションに追加
        serializer.save(user=self.request.user)

class TrainingSessionListView(generics.ListAPIView):
    serializer_class = serializers.TrainingSessionSerializer

    def get_queryset(self):
        """
        ログインしているユーザーのトレーニングセッションとその記録を取得する
        """
        # 認証されたユーザーのIDを使用してクエリを実行
        user = self.request.user
        if not user.is_authenticated:
            return TrainingSession.objects.none()  # 認証されていない場合は空のクエリセットを返す
        return TrainingSession.objects.filter(user=user).prefetch_related('workouts__sets')
