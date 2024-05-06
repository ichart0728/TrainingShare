from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
        serializer.save(profile=self.request.user.userProfile)

    def get_queryset(self):
        return self.queryset.filter(profile=self.request.user.userProfile)

class BodyFatPercentageHistoryViewSet(viewsets.ModelViewSet):
    queryset = BodyFatPercentageHistory.objects.all()
    serializer_class = serializers.BodyFatPercentageHistorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.userProfile)

    def get_queryset(self):
        return self.queryset.filter(profile=self.request.user.userProfile)

class MuscleMassHistoryViewSet(viewsets.ModelViewSet):
    queryset = MuscleMassHistory.objects.all()
    serializer_class = serializers.MuscleMassHistorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.userProfile)

    def get_queryset(self):
        return self.queryset.filter(profile=self.request.user.userProfile)