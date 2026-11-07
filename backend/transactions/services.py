import csv,io
from datetime import datetime
from decimal import Decimal,InvalidOperation
from collections import Counter
from django.db import transaction
from .models import Transaction
REQUIRED=['external_id','occurred_on','amount','currency','category','merchant']
def parse_csv(upload):
 if upload.size>5*1024*1024: raise ValueError('CSV exceeds 5 MB limit')
 try: text=upload.read().decode('utf-8-sig')
 except UnicodeDecodeError: raise ValueError('CSV must be UTF-8')
 reader=csv.DictReader(io.StringIO(text))
 if not reader.fieldnames or not set(REQUIRED).issubset(reader.fieldnames): raise ValueError('Required columns: '+', '.join(REQUIRED))
 records=[]; issues=[]; seen=set()
 for rownum,row in enumerate(reader,2):
  if rownum>10002: raise ValueError('Maximum 10,000 data rows per upload')
  if None in row: issues.append({'row':rownum,'reason':'Unexpected extra columns'});continue
  missing=[k for k in REQUIRED if not (row.get(k) or '').strip()]
  if missing: issues.append({'row':rownum,'reason':'Missing: '+', '.join(missing)});continue
  try:
   date=datetime.strptime(row['occurred_on'].strip(),'%Y-%m-%d').date()
   amount=Decimal(row['amount'].strip())
   if not amount.is_finite() or abs(amount)>=Decimal('1000000000000'): raise ValueError()
  except (ValueError,InvalidOperation):
   issues.append({'row':rownum,'reason':'Invalid date or amount'});continue
  ext=row['external_id'].strip();currency=row['currency'].strip().upper()
  if len(ext)>80 or len(currency)!=3 or not currency.isalpha(): issues.append({'row':rownum,'reason':'Invalid ID or currency'});continue
  if ext in seen: issues.append({'row':rownum,'reason':'Duplicate ID in file'});continue
  seen.add(ext)
  records.append(Transaction(external_id=ext,occurred_on=date,amount=amount,currency=currency,category=row['category'].strip()[:80],merchant=row['merchant'].strip()[:120],description=(row.get('description') or '').strip()[:255]))
 return records,issues
@transaction.atomic
def import_records(records,issues):
 existing=set(Transaction.objects.filter(external_id__in=[r.external_id for r in records]).values_list('external_id',flat=True))
 to_create=[]
 for r in records:
  if r.external_id in existing: issues.append({'row':None,'reason':f'Already imported: {r.external_id}'})
  else: to_create.append(r)
 Transaction.objects.bulk_create(to_create,batch_size=500)
 return {'imported':len(to_create),'rejected':len(issues),'issues':issues[:100]}
