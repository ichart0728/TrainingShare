from rest_framework import serializers
from datetime import timedelta

from .models import Profile, Post, Comment, BodyPart, TrainingMenu, TrainingSession, TrainingRecord, TrainingSet, WeightHistory, BodyFatPercentageHistory, MuscleMassHistory


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
        fields = ['id', 'set_number', 'weight', 'reps', 'completed']
        extra_kwargs = {
            'set_number': {'required': False},
        }

    def validate_reps(self, value):
        if not isinstance(value, int) or value < 0:
            raise serializers.ValidationError("Reps must be a positive integer.")
        return value

    def validate_weight(self, value):
        if value is None or value < 0:
            raise serializers.ValidationError("Weight must be a non-negative number.")
        return value


class TrainingRecordSerializer(serializers.ModelSerializer):
    sets = TrainingSetSerializer(many=True)

    class Meta:
        model = TrainingRecord
        fields = ['id', 'menu', 'body_part', 'sets', 'memo']  # memoを追加


class TrainingSessionSerializer(serializers.ModelSerializer):
    workouts = TrainingRecordSerializer(many=True)

    class Meta:
        model = TrainingSession
        fields = ['id', 'date', 'duration', 'workouts']

    def create(self, validated_data):
        print("Creating TrainingSession with data:", validated_data)
        workouts_data = validated_data.pop('workouts', [])
        duration = validated_data.get('duration')
        if isinstance(duration, int):
            validated_data['duration'] = timedelta(seconds=duration)

        session = TrainingSession.objects.create(**validated_data)
        valid_records = []

        for workout_data in workouts_data:
            sets_data = workout_data.pop('sets', [])
            menu_id = workout_data.pop('menu')
            body_part_id = workout_data.pop('body_part')
            memo = workout_data.get('memo', None)

            menu_instance = TrainingMenu.objects.get(id=menu_id.id)
            body_part_instance = BodyPart.objects.get(id=body_part_id.id)

            record = TrainingRecord.objects.create(
                session=session,
                menu=menu_instance,
                body_part=body_part_instance,
                memo=memo  # メモを保存
            )

            set_number = 1
            for set_data in sets_data:
                set_data['set_number'] = set_number
                set_serializer = TrainingSetSerializer(data=set_data)
                if set_serializer.is_valid():
                    set_serializer.save(record=record)
                    set_number += 1
                else:
                    print(f"Invalid set data: {set_serializer.errors}")
                    continue

            valid_records.append(record)

        session.workouts.set(valid_records)
        return session

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation