from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Profile, Post, Comment, BodyPart, TrainingMenu, TrainingSession, TrainingRecord, TrainingSet

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
        print(f"TrainingRecordSerializer Validated Data: {validated_data}")
        sets_data = validated_data.pop('sets', [])
        record = TrainingRecord.objects.create(**validated_data)

        for index, set_data in enumerate(sets_data, start=1):
            print(f"Set Data: {set_data}")
            TrainingSet.objects.create(record=record, set_number=index, **set_data)
            print("Created a new set!")

        return record

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        print(f"TrainingRecordSerializer Representation: {representation}")
        return representation

class TrainingSessionSerializer(serializers.ModelSerializer):
    workouts = TrainingRecordSerializer(many=True)

    class Meta:
        model = TrainingSession
        fields = ['id', 'date', 'duration', 'workouts']

    def create(self, validated_data):
        print(f"TrainingSessionSerializer Validated Data: {validated_data}")
        records_data = validated_data.pop('workouts', [])
        session = TrainingSession.objects.create(**validated_data)

        for record_data in records_data:
            print(f"Record Data: {record_data}")
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
            print("Created a new record!")

        return session

    def update(self, instance, validated_data):
        print(f"TrainingSessionSerializer Update Validated Data: {validated_data}")
        records_data = validated_data.pop('workouts', [])

        instance.date = validated_data.get('date', instance.date)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.save()

        # 既存のTrainingRecordを削除
        instance.workouts.all().delete()

        for record_data in records_data:
            print(f"Update Record Data: {record_data}")
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
            print("Updated a record!")

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        print(f"TrainingSessionSerializer Representation: {representation}")
        return representation