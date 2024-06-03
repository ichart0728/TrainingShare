from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'user'

router = DefaultRouter()
router.register('profiles', views.ProfileViewSet)
router.register('posts', views.PostViewSet)
router.register('comments', views.CommentViewSet)
router.register('training-records', views.TrainingRecordViewSet)
router.register('training-sessions', views.TrainingSessionViewSet)
router.register('weight-history', views.WeightHistoryViewSet)
router.register('body-fat-percentage-history', views.BodyFatPercentageHistoryViewSet)
router.register('muscle-mass-history', views.MuscleMassHistoryViewSet)

urlpatterns = [
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('posts/<uuid:user_id>/', views.PostListView.as_view(), name='user-posts'),
    path('training-menus/', views.BodyPartWithMenusView.as_view(), name='training-menus'),
    path('my-training-sessions/', views.TrainingSessionListView.as_view(), name='my-trainings'),
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('', include(router.urls)),
]