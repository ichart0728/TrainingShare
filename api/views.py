from rest_framework import generics
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from . import serializers
from .models import Profile, Post, Comment, BodyPart, TrainingMenu, TrainingRecord, TrainingSession, WeightHistory, BodyFatPercentageHistory, MuscleMassHistory
from rest_framework.exceptions import ValidationError
from django.utils import timezone
import datetime

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

    def perform_create(self, serializer):
        serializer.save(userProfile=self.request.user)

    def perform_update(self, serializer):
        serializer.save(userProfile=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(userProfile=self.request.user)

class MyProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    def get_queryset(self):
        return self.queryset.filter(userProfile=self.request.user)

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
        過去半年間のデータのみを取得
        """
        user = self.request.user
        if not user.is_authenticated:
            return TrainingSession.objects.none()  # 認証されていない場合は空のクエリセットを返す

        # 現在日付から半年前の日付を計算
        six_months_ago = timezone.now() - datetime.timedelta(days=180)

        # 過去半年間のデータのみをフィルタリングして取得
        return TrainingSession.objects.filter(user=user, date__gte=six_months_ago).prefetch_related('workouts__sets')

class WeightHistoryCreateView(generics.CreateAPIView):
    queryset = WeightHistory.objects.all()
    serializer_class = serializers.WeightHistorySerializer

    def perform_create(self, serializer):
        try:
            serializer.save(profile=self.request.user.userProfile)
        except Exception as e:
            raise

class BodyFatPercentageHistoryCreateView(generics.CreateAPIView):
    queryset = BodyFatPercentageHistory.objects.all()
    serializer_class = serializers.BodyFatPercentageHistorySerializer

    def perform_create(self, serializer):
        try:
            serializer.save(profile=self.request.user.userProfile)
        except Exception as e:
            raise

class MuscleMassHistoryCreateView(generics.CreateAPIView):
    queryset = MuscleMassHistory.objects.all()
    serializer_class = serializers.MuscleMassHistorySerializer

    def dispatch(self, request, *args, **kwargs):
        # リクエストデータをログに出力
        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):

        try:
            serializer.save(profile=self.request.user.userProfile)
        except Exception as e:
            raise

class WeightHistoryListView(generics.ListAPIView):
    serializer_class = serializers.WeightHistorySerializer

    def get_queryset(self):
        profile = self.request.user.userProfile
        return WeightHistory.objects.filter(profile=profile)

class BodyFatPercentageHistoryListView(generics.ListAPIView):
    serializer_class = serializers.BodyFatPercentageHistorySerializer

    def get_queryset(self):
        profile = self.request.user.userProfile
        return BodyFatPercentageHistory.objects.filter(profile=profile)

class MuscleMassHistoryListView(generics.ListAPIView):
    serializer_class = serializers.MuscleMassHistorySerializer

    def get_queryset(self):
        profile = self.request.user.userProfile
        return MuscleMassHistory.objects.filter(profile=profile)