# Generated by Django 5.0.3 on 2024-04-21 14:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_trainingset_completed'),
    ]

    operations = [
        migrations.RenameField(
            model_name='trainingrecord',
            old_name='menu',
            new_name='menuId',
        ),
    ]
