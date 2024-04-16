# Generated by Django 5.0.3 on 2024-04-16 12:16

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_follow'),
    ]

    operations = [
        migrations.CreateModel(
            name='BodyPart',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='TrainingMenu',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('bodyPart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='training_menus', to='api.bodypart')),
            ],
        ),
        migrations.CreateModel(
            name='TrainingRecord',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('weight', models.FloatField()),
                ('reps', models.IntegerField()),
                ('sets', models.IntegerField()),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('menu', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='training_records', to='api.trainingmenu')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='training_records', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
