from django.db import models
class Transaction(models.Model):
 external_id=models.CharField(max_length=80,db_index=True)
 occurred_on=models.DateField(db_index=True)
 amount=models.DecimalField(max_digits=14,decimal_places=2)
 currency=models.CharField(max_length=3,default='USD')
 category=models.CharField(max_length=80,blank=True)
 merchant=models.CharField(max_length=120,blank=True)
 description=models.CharField(max_length=255,blank=True)
 imported_at=models.DateTimeField(auto_now_add=True)
 class Meta:
  ordering=['-occurred_on','-id']
  indexes=[models.Index(fields=['category','occurred_on'])]
