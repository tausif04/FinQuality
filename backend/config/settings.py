import os
from pathlib import Path
import dj_database_url
BASE_DIR=Path(__file__).resolve().parent.parent
SECRET_KEY=os.getenv('DJANGO_SECRET_KEY','dev-only-insecure-key')
DEBUG=os.getenv('DJANGO_DEBUG','0')=='1'
ALLOWED_HOSTS=os.getenv('DJANGO_ALLOWED_HOSTS','localhost,127.0.0.1').split(',')
INSTALLED_APPS=['django.contrib.auth','django.contrib.contenttypes','django.contrib.sessions','django.contrib.messages','django.contrib.staticfiles','rest_framework','corsheaders','transactions']
MIDDLEWARE=['django.middleware.security.SecurityMiddleware','corsheaders.middleware.CorsMiddleware','django.middleware.common.CommonMiddleware','django.middleware.csrf.CsrfViewMiddleware','django.contrib.sessions.middleware.SessionMiddleware','django.contrib.auth.middleware.AuthenticationMiddleware','django.contrib.messages.middleware.MessageMiddleware']
ROOT_URLCONF='config.urls'
TEMPLATES=[]
WSGI_APPLICATION='config.wsgi.application'
DATABASES={'default':dj_database_url.config(default='sqlite:///'+str(BASE_DIR/'db.sqlite3'),conn_max_age=60)}
CORS_ALLOWED_ORIGINS=[x for x in os.getenv('CORS_ALLOWED_ORIGINS','http://localhost:5173').split(',') if x]
REST_FRAMEWORK={'DEFAULT_RENDERER_CLASSES':['rest_framework.renderers.JSONRenderer'],'DEFAULT_PARSER_CLASSES':['rest_framework.parsers.JSONParser','rest_framework.parsers.MultiPartParser','rest_framework.parsers.FormParser']}
LANGUAGE_CODE='en-us'; TIME_ZONE='UTC'; USE_TZ=True
STATIC_URL='static/'
DEFAULT_AUTO_FIELD='django.db.models.BigAutoField'
DATA_UPLOAD_MAX_MEMORY_SIZE=6*1024*1024
FILE_UPLOAD_MAX_MEMORY_SIZE=6*1024*1024
