from django.urls import path
from . import views
urlpatterns=[path('health/',views.health),path('upload/',views.upload),path('transactions/',views.transactions),path('summary/',views.summary),path('quality/',views.quality),path('export/',views.export)]
