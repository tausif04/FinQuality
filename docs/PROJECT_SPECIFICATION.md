# Project Specification — FinQuality

## 1. Purpose
FinQuality is an intermediate-level analytics and data-quality dashboard for importing synthetic financial transactions, finding data integrity issues, and understanding spending and cash-flow patterns.

## 2. Problem statement
Transaction CSV exports are often inconsistent, contain duplicate identifiers or invalid fields, and are difficult to summarize manually. FinQuality creates a repeatable ingestion, validation, storage, analytics, and reporting workflow.

## 3. Target users
Junior financial analysts, data quality analysts, and internal operations teams (demonstration only).

## 4. Functional requirements
FR-01: Upload CSV (UTF-8, max 5 MB, 10,000 rows).
FR-02: Validate required columns, dates, decimal amounts, currency codes, and external IDs.
FR-03: Reject duplicate IDs within files and existing imported IDs.
FR-04: Store accepted transactions in a relational database.
FR-05: Filter records by currency, category, and date interval.
FR-06: Provide summary KPIs and month/category breakdowns.
FR-07: Visualize trends and expense categories.
FR-08: Show data-quality counts and import issues.
FR-09: Export filtered records to CSV.
FR-10: Provide paginated transaction history.

## 5. Non-functional requirements
NFR-01: Modular backend service and REST endpoints.
NFR-02: Use Decimal in Python and NUMERIC in PostgreSQL for monetary precision.
NFR-03: Restrict upload size and row count.
NFR-04: Provide reproducible Docker local setup and synthetic seed CSV.
NFR-05: Responsive UI for desktop and mobile.
NFR-06: Backend automated tests for core ingestion and summary logic.

## 6. Architecture and data flow
CSV upload → Django DRF upload endpoint → Python csv/Decimal validation → PostgreSQL transaction table → ORM SQL aggregation → JSON API → React/Recharts dashboard. Export API generates a CSV from filtered stored transactions.

## 7. Data model
Transaction: id (PK), external_id (indexed), occurred_on (indexed), amount (NUMERIC(14,2)), currency (CHAR(3)), category, merchant, description, imported_at. Signed amounts: income > 0, expenses < 0.

## 8. Technology responsibility
- Python 3.12: ingestion, parsing, business logic, and CSV reporting.
- Django + Django REST Framework: REST endpoints, serializers, validation orchestration, ORM.
- PostgreSQL 16: persistent relational storage, filtering, grouping, sums and counts.
- React 18 + TypeScript: interactive dashboard, upload controls, filters, tables, pagination.
- Recharts: cash-flow area chart and category spending bar chart.
- CSS: responsive UI and dashboard styling.
- Docker Compose: reproducible database/backend/frontend orchestration.
- Django TestCase: API regression tests.
- Pandas: listed as an optional data-analysis dependency for future ETL extensions; current processing deliberately uses the Python standard-library csv module and Django ORM rather than Pandas.

## 9. Acceptance criteria
1. Docker services start and health endpoint returns `status: ok`.
2. Sample CSV imports 240 transactions on first upload and 0 on repeat upload.
3. Dashboard shows transaction counts, income, expenses, and monthly/category charts.
4. Invalid sample CSV reports duplicate ID, invalid date, and missing amount.
5. Filtered export downloads a CSV with matching records.
6. `python manage.py test` passes.

## 10. Design decisions and limitations
- No authentication: use only synthetic records; never expose publicly.
- Global external ID deduplication may be too broad for real bank feeds; a composite key should include account and source.
- No database uniqueness constraint, so concurrent import races remain possible.
- No currency normalization; financial metrics should be filtered to one currency.
- Invalid required fields are rejected, so incomplete stored fields require legacy data or an alternate import source.
- Monthly trend is transaction cash flow, not account balances.
- No async job queue; uploads are bounded and synchronous.

## 11. Potential enhancements
Role-based access, Celery/Redis background jobs, Pandas-based ETL, import batch audit history, reconciliation, account-scoped unique constraints, pytest coverage, CI/CD, advanced anomaly detection, and PDF reporting.
