from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'user'

router = DefaultRouter()

# viewsets.ModelViewSetを継承しているViewはDefaultRouterに設定
router.register('profile', views.ProfileViewSet)
router.register('post', views.PostViewSet)
router.register('comment', views.CommentViewSet)
router.register('body_part', views.BodyPartViewSet)
router.register('training_menu', views.TrainingMenuViewSet)
router.register('training_record', views.TrainingRecordViewSet)

urlpatterns = [
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('myprofile/', views.MyProfileListView.as_view(), name='myprofile'),
    path('profile/<uuid:pk>', views.ProfileListView.as_view(), name='profile'),
    path('post/<uuid:pk>', views.PostListView.as_view(), name='post'),
    path('training_record/<uuid:pk>', views.TrainingRecordListView.as_view(), name='training_record'),
    path('',include(router.urls))
]

