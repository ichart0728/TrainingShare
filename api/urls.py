from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'user'

router = DefaultRouter()

# viewsets.ModelViewSetを継承しているViewはDefaultRouterに設定
router.register('profile', views.ProfileViewSet)
router.register('posts', views.PostViewSet)
router.register('comments', views.CommentViewSet)
router.register('training_sessions', views.TrainingSessionViewSet)
urlpatterns = [
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('myprofile/', views.MyProfileListView.as_view(), name='myprofile'),
    path('profiles/<uuid:user_id>/', views.ProfileListView.as_view(), name='profile-detail'),
    path('profiles/weightHistory/create/', views.WeightHistoryCreateView.as_view(), name='weightHistory_create'),
    path('profiles/bodyFatPercentageHistory/create/', views.BodyFatPercentageHistoryCreateView.as_view(), name='bodyFatPercentageHistory_create'),
    path('profiles/muscleMassHistory/create/', views.MuscleMassHistoryCreateView.as_view(), name='muscleMassHistory_create'),
    path('profiles/weightHistory/list/', views.WeightHistoryListView.as_view(), name='weightHistory_list'),
    path('profiles/bodyFatPercentageHistory/list/', views.BodyFatPercentageHistoryListView.as_view(), name='bodyFatPercentageHistory_list'),
    path('profiles/muscleMassHistory/list/', views.MuscleMassHistoryListView.as_view(), name='muscleMassHistory_list'),
    path('posts/<uuid:user_id>/', views.PostListView.as_view(), name='user-posts'),
    path('training_menus/', views.BodyPartWithMenusView.as_view(), name='training_menus'),
    path('my_training_sessions/', views.TrainingSessionListView.as_view(), name='my-trainings'),
    path('', include(router.urls))
]
