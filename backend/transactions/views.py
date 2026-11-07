import csv,io
from datetime import date
from django.db.models import Sum,Count,Q
from django.db.models.functions import TruncMonth
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction
from .serializers import TransactionSerializer
from .services import parse_csv,import_records

def filtered(request):
 qs=Transaction.objects.all()
 for field in ['currency','category']:
  if request.query_params.get(field): qs=qs.filter(**{field:request.query_params[field]})
 for param,lookup in [('start','occurred_on__gte'),('end','occurred_on__lte')]:
  value=request.query_params.get(param)
  if value:
   try: date.fromisoformat(value)
   except ValueError: raise ValueError(f'{param} must be YYYY-MM-DD')
   qs=qs.filter(**{lookup:value})
 return qs
@api_view(['GET'])
def health(request): return Response({'status':'ok'})
@api_view(['POST'])
def upload(request):
 file=request.FILES.get('file')
 if not file: return Response({'error':'Upload a CSV file using field "file"'},status=400)
 if not file.name.lower().endswith('.csv'): return Response({'error':'Only .csv files accepted'},status=400)
 try: records,issues=parse_csv(file);result=import_records(records,issues)
 except ValueError as e: return Response({'error':str(e)},status=400)
 return Response(result,status=201)
@api_view(['GET'])
def transactions(request):
 try: qs=filtered(request)
 except ValueError as e:return Response({'error':str(e)},status=400)
 try: page=max(1,int(request.query_params.get('page',1)))
 except ValueError:return Response({'error':'Invalid page'},status=400)
 size=25; total=qs.count()
 return Response({'count':total,'page':page,'page_size':size,'results':TransactionSerializer(qs[(page-1)*size:page*size],many=True).data})
@api_view(['GET'])
def summary(request):
 try: qs=filtered(request)
 except ValueError as e:return Response({'error':str(e)},status=400)
 totals=qs.aggregate(count=Count('id'),income=Sum('amount',filter=Q(amount__gt=0)),expenses=Sum('amount',filter=Q(amount__lt=0)))
 income=totals['income'] or 0; expenses=totals['expenses'] or 0
 by_category=list(qs.values('category').annotate(total=Sum('amount'),count=Count('id')).order_by('category'))
 by_month=list(qs.annotate(month=TruncMonth('occurred_on')).values('month').annotate(income=Sum('amount',filter=Q(amount__gt=0)),expenses=Sum('amount',filter=Q(amount__lt=0))).order_by('month'))
 return Response({'count':totals['count'],'income':str(income),'expenses':str(expenses),'net':str(income+expenses),'by_category':[{'category':r['category'] or 'Uncategorized','total':str(r['total']),'count':r['count']} for r in by_category],'by_month':[{'month':r['month'].strftime('%Y-%m'),'income':str(r['income'] or 0),'expenses':str(r['expenses'] or 0)} for r in by_month]})
@api_view(['GET'])
def quality(request):
 try: qs=filtered(request)
 except ValueError as e:return Response({'error':str(e)},status=400)
 missing=qs.filter(Q(category='')|Q(merchant='')).count()
 duplicate_groups=list(qs.values('external_id').annotate(n=Count('id')).filter(n__gt=1).order_by('-n')[:50])
 return Response({'total_records':qs.count(),'missing_optional_fields':missing,'duplicate_id_groups':len(duplicate_groups),'duplicate_samples':duplicate_groups})
@api_view(['GET'])
def export(request):
 try: qs=filtered(request)
 except ValueError as e:return Response({'error':str(e)},status=400)
 response=HttpResponse(content_type='text/csv');response['Content-Disposition']='attachment; filename="financial_report.csv"'
 writer=csv.writer(response);writer.writerow(['external_id','occurred_on','amount','currency','category','merchant','description'])
 for t in qs.iterator(): writer.writerow([t.external_id,t.occurred_on,t.amount,t.currency,t.category,t.merchant,t.description])
 return response
