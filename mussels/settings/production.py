from .base import *

STATIC_ROOT = "/home/ZaidEcosoph/mussels/assets/"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

with open("/keys/secret_mussels.txt") as t:
    SECRET_KEY = t.read().strip()

INSTALLED_APPS.append("compressor")

ALLOWED_HOSTS = ["mussels.iob.watch"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
    }
}

with open("/keys/database_mussels.txt") as t:
    for line in t.readlines():
        DATABASES["default"][line.split(":")[0]] = line.split(":")[1]

with open("/keys/email_mussels.txt") as t:
    EMAIL_HOST_USER, EMAIL_HOST_PASSWORD = t.read().strip().split(":")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "level": "CRITICAL",
            "class": "logging.FileHandler",
            "filename": "debug.log",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "level": "CRITICAL",
            "propagate": True,
        },
    },
}
