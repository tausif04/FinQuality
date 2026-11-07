from django.db import migrations,models
class Migration(migrations.Migration):
 initial=True
 dependencies=[]
 operations=[migrations.CreateModel(name='Transaction',fields=[('id',models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name='ID')),('external_id',models.CharField(db_index=True,max_length=80)),('occurred_on',models.DateField(db_index=True)),('amount',models.DecimalField(decimal_places=2,max_digits=14)),('currency',models.CharField(default='USD',max_length=3)),('category',models.CharField(blank=True,max_length=80)),('merchant',models.CharField(blank=True,max_length=120)),('description',models.CharField(blank=True,max_length=255)),('imported_at',models.DateTimeField(auto_now_add=True))],options={'ordering':['-occurred_on','-id'],'indexes':[models.Index(fields=['category','occurred_on'],name='trans_cat_date_idx')]})]
