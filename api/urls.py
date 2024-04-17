from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'user'

router = DefaultRouter()

# viewsets.ModelViewSetを継承しているViewはDefaultRouterに設定
router.register('profiles', views.ProfileViewSet)
router.register('posts', views.PostViewSet)
router.register('comments', views.CommentViewSet)
router.register('body_parts', views.BodyPartViewSet)
router.register('training_menus', views.TrainingMenuViewSet)
router.register('training_records', views.TrainingRecordViewSet)

urlpatterns = [
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('myprofile/', views.MyProfileListView.as_view(), name='myprofile'),
    path('profiles/<uuid:user_id>/', views.ProfileListView.as_view(), name='profile-detail'),
    path('posts/<uuid:user_id>/', views.PostListView.as_view(), name='user-posts'),
    path('training_records/user/<uuid:user_id>/', views.TrainingRecordListView.as_view(), name='user-training-records'),
    path('', include(router.urls))
]
