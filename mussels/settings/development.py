from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ")d&$=99_2x%8_^zfeojk3h4&u3qor5tnfhnk#%62s6fa8p1iy("

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]


# For testing, sqLite3
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }
}
