from io import BytesIO
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Transaction
class ApiTests(TestCase):
 def test_upload_validation_dedup_and_summary(self):
  data=b'external_id,occurred_on,amount,currency,category,merchant,description\nA1,2026-01-01,120.50,USD,Salary,Employer,Pay\nA1,2026-01-01,120.50,USD,Salary,Employer,Pay\nA2,2026-01-02,-20,USD,Food,Cafe,Lunch\nA3,wrong,3,USD,Food,Cafe,Invalid\n'
  response=self.client.post('/api/upload/',{'file':SimpleUploadedFile('test.csv',data,content_type='text/csv')})
  self.assertEqual(response.status_code,201)
  self.assertEqual(response.json()['imported'],2)
  self.assertEqual(response.json()['rejected'],2)
  self.assertEqual(self.client.get('/api/summary/').json()['net'],'100.50')
  response=self.client.post('/api/upload/',{'file':SimpleUploadedFile('test.csv',data)})
  self.assertEqual(response.json()['imported'],0)
 def test_filter_and_quality(self):
  Transaction.objects.create(external_id='X',occurred_on='2026-02-01',amount=-10,currency='USD',category='',merchant='')
  self.assertEqual(self.client.get('/api/quality/').json()['missing_optional_fields'],1)
  self.assertEqual(self.client.get('/api/transactions/?currency=EUR').json()['count'],0)
  self.assertEqual(self.client.get('/api/summary/?start=bad').status_code,400)
