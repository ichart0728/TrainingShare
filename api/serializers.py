from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile, Post, Comment, BodyPart, TrainingMenu, TrainingRecord

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        # 現在アクティブなユーザーを取得
        model = get_user_model()
        fields = ('id', 'email', 'password')
        # クライアントからパスワードを参照できないように書き込み専用で設定
        extra_kwargs = {'password': {'write_only': True}, 'id': {'read_only': True}}

    def create(self, validated_data):
        '''
        バリデーションを通過したデータに対して、ユーザーを作成する
        :params: validated_data
            ユーザーが入力したメールアドレス

        :return: user
            作成したユーザーのインスタンス
        '''
        user = get_user_model().objects.create_user(**validated_data)
        return user


class ProfileSerializer(serializers.ModelSerializer):

    created_on = serializers.DateTimeField(format='%Y-%m-%d', read_only=True)

    class Meta:
        model = Profile
        fields = ('id', 'nickName', 'userProfile', 'created_on', 'img')
        # サーバー側で識別可能なので、クライアント側からログインユーザーを指定しないようにしておく
        extra_kwargs = {'userProfile': {'read_only': True}}


class PostSerializer(serializers.ModelSerializer):

    created_on = serializers.DateTimeField(format='%Y-%m-%d', read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'title', 'userPost', 'created_on', 'img', 'liked')
        extra_kwargs = {'userPost': {'read_only': True}}


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'text', 'userComment', 'post')
        extra_kwargs = {'userComment': {'read_only': True}}

# BodyPartモデルのシリアライザー
class BodyPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyPart
        fields = ('id', 'name')

# TrainingMenuモデルのシリアライザー
class TrainingMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingMenu
        fields = ('id', 'name', 'bodyPart')
        extra_kwargs = {'bodyPart': {'read_only': True}}

# TrainingRecord)のモデルのシリアライザー
class TrainingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingRecord
        fields = ('id', 'user', 'menu', 'date', 'weight', 'reps', 'sets', 'created_on')
        extra_kwargs = {'user': {'read_only': True}}