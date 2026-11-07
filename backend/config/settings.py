
import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv


# ==========================================
# BASE CONFIGURATION
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

env_file = BASE_DIR.parent / ".env.local"

if not env_file.exists():
    env_file = BASE_DIR.parent / ".env"

load_dotenv(env_file, override=True)


# ==========================================
# SECURITY CONFIGURATION
# ==========================================

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

DEBUG = os.getenv("DJANGO_DEBUG", "0") == "1"

if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "dev-only-insecure-key"
    else:
        raise RuntimeError(
            "DJANGO_SECRET_KEY must be configured."
        )


ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        "DJANGO_ALLOWED_HOSTS",
        "localhost,127.0.0.1"
    ).split(",")
    if host.strip()
]


# ==========================================
# APPLICATIONS
# ==========================================

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",

    "transactions",
]


# ==========================================
# MIDDLEWARE
# ==========================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]


# ==========================================
# URL CONFIGURATION
# ==========================================

ROOT_URLCONF = "config.urls"

TEMPLATES = []

WSGI_APPLICATION = "config.wsgi.application"


# ==========================================
# DATABASE CONFIGURATION
# ==========================================

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL and not DEBUG:
    raise RuntimeError(
        "DATABASE_URL must be configured in production."
    )

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ==========================================
# CORS CONFIGURATION
# ==========================================

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173"
    ).split(",")
    if origin.strip()
]


# ==========================================
# DJANGO REST FRAMEWORK
# ==========================================

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],

    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ],
}


# ==========================================
# INTERNATIONALIZATION
# ==========================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_TZ = True


# ==========================================
# STATIC FILES
# ==========================================

STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / "staticfiles"


# ==========================================
# PRODUCTION SECURITY
# ==========================================

SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO",
    "https",
)

if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_CONTENT_TYPE_NOSNIFF = True


# ==========================================
# DEFAULT MODEL FIELD
# ==========================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ==========================================
# FILE UPLOAD LIMITS
# ==========================================

DATA_UPLOAD_MAX_MEMORY_SIZE = 6 * 1024 * 1024

FILE_UPLOAD_MAX_MEMORY_SIZE = 6 * 1024 * 1024
