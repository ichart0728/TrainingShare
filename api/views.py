from rest_framework import generics, viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from django.utils import timezone
import datetime
from . import serializers
from .models import Profile, Post, Comment, BodyPart, TrainingMenu, TrainingRecord, TrainingSession, WeightHistory, BodyFatPercentageHistory, MuscleMassHistory

# 新規ユーザー作成用View
class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (AllowAny,)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(userProfile=self.request.user)

    def perform_update(self, serializer):
        serializer.save(userProfile=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(userProfile=self.request.user)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(userPost=self.request.user)

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer

    def get_queryset(self):
        return self.queryset.filter(userPost=self.kwargs['user_id'])

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(userComment=self.request.user)

class BodyPartWithMenusView(generics.ListAPIView):
    queryset = BodyPart.objects.all().prefetch_related('training_menus')
    serializer_class = serializers.BodyPartSerializer

    def get_queryset(self):
        return self.queryset.prefetch_related('training_menus')

class TrainingSessionViewSet(viewsets.ModelViewSet):
    queryset = TrainingSession.objects.all()
    serializer_class = serializers.TrainingSessionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print("Request data:", request.data)  # デバッグ情報を追加
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            print(f"Validation error: {e.detail}")  # 詳細なエラーメッセージを表示
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        print("Performing create with data:", serializer.validated_data)  # デバッグ情報を追加
        serializer.save(user=self.request.user)
        print("Creation successful")


class TrainingSessionListView(generics.ListAPIView):
    serializer_class = serializers.TrainingSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        six_months_ago = timezone.now() - datetime.timedelta(days=180)
        return TrainingSession.objects.filter(user=user, date__gte=six_months_ago).prefetch_related('workouts__sets')

class WeightHistoryViewSet(viewsets.ModelViewSet):
    queryset = WeightHistory.objects.all()
    serializer_class = serializers.WeightHistorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        date = serializer.validated_data['date']
        profile = self.request.user.userProfile
        weight_history, created = WeightHistory.objects.update_or_create(
            profile=profile,
            date=date,
            defaults=serializer.validated_data
        )

    def get_queryset(self):
        return self.queryset.filter(profile=self.request.user.userProfile)

class BodyFatPercentageHistoryViewSet(viewsets.ModelViewSet):
    queryset = BodyFatPercentageHistory.objects.all()
    serializer_class = serializers.BodyFatPercentageHistorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        date = serializer.validated_data['date']
        profile = self.request.user.userProfile
        body_fat_percentage_history, created = BodyFatPercentageHistory.objects.update_or_create(
            profile=profile,
            date=date,
            defaults=serializer.validated_data
        )

    def get_queryset(self):
        return self.queryset.filter(profile=self.request.user.userProfile)

class MuscleMassHistoryViewSet(viewsets.ModelViewSet):
    queryset = MuscleMassHistory.objects.all()
    serializer_class = serializers.MuscleMassHistorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        date = serializer.validated_data['date']
        profile = self.request.user.userProfile
        muscle_mass_history, created = MuscleMassHistory.objects.update_or_create(
            profile=profile,
            date=date,
            defaults=serializer.validated_data
        )

    def get_queryset(self):
        return self.queryset.filter(profile=self.request.user.userProfile)