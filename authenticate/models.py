from django.db import models

# Class used for login
class Post(models.Model):
    Username = models.CharField(max_length=50)
    Password = models.CharField(max_length=50)
    Remember = models.BooleanField()
