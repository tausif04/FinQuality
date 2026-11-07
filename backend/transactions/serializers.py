from rest_framework import serializers
from .models import Transaction
class TransactionSerializer(serializers.ModelSerializer):
 class Meta:
  model=Transaction
  fields=['id','external_id','occurred_on','amount','currency','category','merchant','description']
