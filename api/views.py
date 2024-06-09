from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from django.utils import timezone
import datetime
from . import serializers
from .models import Profile, Post, Comment, BodyPart, TrainingMenu, TrainingRecord, TrainingSession, WeightHistory, BodyFatPercentageHistory, MuscleMassHistory, User
from rest_framework.views import APIView
from firebase_admin import auth
from rest_framework.permissions import AllowAny

class FirebaseRegisterView(APIView):
    permission_classes = [AllowAny,]
    def post(self, request):
        id_token = request.data.get('token')
        try:
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            email = decoded_token['email']
            name = decoded_token.get('name', '')
            user, created = User.objects.get_or_create(email=email, defaults={
                'social_login_uid': uid,
                'social_login_provider': 'firebase'
            })
            return Response({'message': 'User registered successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    def perform_create(self, serializer):
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user, created = User.objects.get_or_create(email=firebase_user['email'], defaults={
            'social_login_uid': firebase_user['uid'],
            'social_login_provider': 'firebase'
        })
        serializer.save(userProfile=user)

    def perform_update(self, serializer):
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        serializer.save(userProfile=user)

    def get_queryset(self):
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        return self.queryset.filter(userProfile=user)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer

    def perform_create(self, serializer):
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        serializer.save(userPost=user)


class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer

    def get_queryset(self):
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        return self.queryset.filter(userPost=user)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer

    def perform_create(self, serializer):
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        serializer.save(userComment=user)


class BodyPartWithMenusView(generics.ListAPIView):
    queryset = BodyPart.objects.all().prefetch_related('training_menus')
    serializer_class = serializers.BodyPartSerializer

    def get_queryset(self):
        return self.queryset.prefetch_related('training_menus')


class TrainingRecordViewSet(viewsets.ModelViewSet):
    queryset = TrainingRecord.objects.all()
    serializer_class = serializers.TrainingRecordSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()


class TrainingSessionViewSet(viewsets.ModelViewSet):
    queryset = TrainingSession.objects.all()
    serializer_class = serializers.TrainingSessionSerializer

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
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        serializer.save(user=user)
        print("Creation successful")


class TrainingSessionListView(generics.ListAPIView):
    serializer_class = serializers.TrainingSessionSerializer

    def get_queryset(self):
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        six_months_ago = timezone.now() - datetime.timedelta(days=180)
        return TrainingSession.objects.filter(user=user, date__gte=six_months_ago).prefetch_related('workouts__sets')


class WeightHistoryViewSet(viewsets.ModelViewSet):
    queryset = WeightHistory.objects.all()
    serializer_class = serializers.WeightHistorySerializer

    def perform_create(self, serializer):
        date = serializer.validated_data['date']
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        profile = user.userProfile
        weight_history, created = WeightHistory.objects.update_or_create(
            profile=profile,
            date=date,
            defaults=serializer.validated_data
        )

    def get_queryset(self):
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        return self.queryset.filter(profile=user.userProfile)


class BodyFatPercentageHistoryViewSet(viewsets.ModelViewSet):
    queryset = BodyFatPercentageHistory.objects.all()
    serializer_class = serializers.BodyFatPercentageHistorySerializer

    def perform_create(self, serializer):
        date = serializer.validated_data['date']
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        profile = user.userProfile
        body_fat_percentage_history, created = BodyFatPercentageHistory.objects.update_or_create(
            profile=profile,
            date=date,
            defaults=serializer.validated_data
        )

    def get_queryset(self):
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        return self.queryset.filter(profile=user.userProfile)


class MuscleMassHistoryViewSet(viewsets.ModelViewSet):
    queryset = MuscleMassHistory.objects.all()
    serializer_class = serializers.MuscleMassHistorySerializer

    def perform_create(self, serializer):
        date = serializer.validated_data['date']
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        profile = user.userProfile
        muscle_mass_history, created = MuscleMassHistory.objects.update_or_create(
            profile=profile,
            date=date,
            defaults=serializer.validated_data
        )

    def get_queryset(self):
        firebase_user = auth.verify_id_token(self.request.META['HTTP_AUTHORIZATION'].split(' ')[1])
        user = User.objects.get(email=firebase_user['email'])
        return self.queryset.filter(profile=user.userProfile)