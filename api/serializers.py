from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Profile, Post, Comment, BodyPart, TrainingMenu, TrainingSession, TrainingRecord, TrainingSet, WeightHistory, BodyFatPercentageHistory, MuscleMassHistory

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
    weightHistory = serializers.SerializerMethodField()
    bodyFatPercentageHistory = serializers.SerializerMethodField()
    muscleMassHistory = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('id', 'nickName', 'userProfile', 'created_on', 'img', 'gender', 'height', 'dateOfBirth', 'weightHistory', 'bodyFatPercentageHistory', 'muscleMassHistory')
        extra_kwargs = {'userProfile': {'read_only': True}}

    def get_weightHistory(self, obj):
        weightHistory = WeightHistory.objects.filter(profile=obj).order_by('date')[:365]
        return WeightHistorySerializer(weightHistory, many=True).data

    def get_bodyFatPercentageHistory(self, obj):
        bodyFatPercentageHistory = BodyFatPercentageHistory.objects.filter(profile=obj).order_by('date')[:365]
        return BodyFatPercentageHistorySerializer(bodyFatPercentageHistory, many=True).data

    def get_muscleMassHistory(self, obj):
        muscleMassHistory = MuscleMassHistory.objects.filter(profile=obj).order_by('date')[:365]
        return MuscleMassHistorySerializer(muscleMassHistory, many=True).data

class WeightHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightHistory
        fields = ('weight', 'date')

class BodyFatPercentageHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyFatPercentageHistory
        fields = ('bodyFatPercentage', 'date')

class MuscleMassHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MuscleMassHistory
        fields = ('muscleMass', 'date')

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


# TrainingMenuモデルのシリアライザー
class TrainingMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingMenu
        fields = ('id', 'name')

# BodyPartモデルのシリアライザー
class BodyPartSerializer(serializers.ModelSerializer):
    training_menus = TrainingMenuSerializer(many=True, read_only=True)

    class Meta:
        model = BodyPart
        fields = ('id', 'name', 'training_menus')

# TrainingSetモデルのシリアライザー
class TrainingSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingSet
        fields = ['id', 'weight', 'reps', 'completed']
        extra_kwargs = {
            'id': {'read_only': True}
        }
    def validate(self, data):
        data.pop('Id', None)
        return data

class TrainingRecordSerializer(serializers.ModelSerializer):
    sets = TrainingSetSerializer(many=True)
    menu = serializers.PrimaryKeyRelatedField(
        queryset=TrainingMenu.objects.all()
    )
    body_part = serializers.PrimaryKeyRelatedField(
        queryset=BodyPart.objects.all(),
        allow_null=True
    )

    class Meta:
        model = TrainingRecord
        fields = ['id', 'menu', 'body_part', 'sets']

    def create(self, validated_data):
        sets_data = validated_data.pop('sets', [])
        record = TrainingRecord.objects.create(**validated_data)

        for index, set_data in enumerate(sets_data, start=1):
            TrainingSet.objects.create(record=record, set_number=index, **set_data)

        return record

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation

class TrainingSessionSerializer(serializers.ModelSerializer):
    workouts = TrainingRecordSerializer(many=True)

    class Meta:
        model = TrainingSession
        fields = ['id', 'date', 'duration', 'workouts']

    def create(self, validated_data):
        records_data = validated_data.pop('workouts', [])
        session = TrainingSession.objects.create(**validated_data)

        for record_data in records_data:
            menu_id = record_data.get('menu')
            body_part_id = record_data.get('body_part')

            if isinstance(menu_id, TrainingMenu):
                menu_id = menu_id.id
            if isinstance(body_part_id, BodyPart):
                body_part_id = body_part_id.id

            record_data['menu'] = menu_id
            record_data['body_part'] = body_part_id

            record_serializer = TrainingRecordSerializer(data=record_data)
            record_serializer.is_valid(raise_exception=True)
            record_serializer.save(session=session)

        return session

    def update(self, instance, validated_data):
        records_data = validated_data.pop('workouts', [])

        instance.date = validated_data.get('date', instance.date)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.save()

        # 既存のTrainingRecordを削除
        instance.workouts.all().delete()

        for record_data in records_data:
            menu_id = record_data.get('menu')
            body_part_id = record_data.get('body_part')

            if isinstance(menu_id, TrainingMenu):
                menu_id = menu_id.id
            if isinstance(body_part_id, BodyPart):
                body_part_id = body_part_id.id

            record_data['menu'] = menu_id
            record_data['body_part'] = body_part_id

            record_serializer = TrainingRecordSerializer(data=record_data)
            record_serializer.is_valid(raise_exception=True)
            record_serializer.save(session=instance)

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation