-- PostgreSQL reference queries; the API uses Django ORM equivalents.
-- Monthly cashflow (signed amount convention: income positive, expense negative)
SELECT date_trunc('month',occurred_on)::date AS month,
 SUM(CASE WHEN amount>0 THEN amount ELSE 0 END) AS income,
 SUM(CASE WHEN amount<0 THEN -amount ELSE 0 END) AS spending
FROM transactions_transaction GROUP BY 1 ORDER BY 1;
-- Duplicate external identifiers
SELECT external_id,COUNT(*) AS occurrences FROM transactions_transaction
GROUP BY external_id HAVING COUNT(*)>1 ORDER BY occurrences DESC;
-- Missing merchant or category
SELECT COUNT(*) AS incomplete_rows FROM transactions_transaction
WHERE category='' OR merchant='';
-- Category spending by currency (do not sum currencies together)
SELECT currency,category,SUM(-amount) AS spending FROM transactions_transaction
WHERE amount<0 GROUP BY currency,category ORDER BY currency,spending DESC;
