# FinQuality — Financial Data Analytics & Quality Dashboard

Intermediate portfolio project built with **Django REST Framework, PostgreSQL, Pandas-compatible Python analytics, React, TypeScript, Recharts, and Docker**.

## Features
- Import UTF-8 CSV transaction files with row-level validation and duplicate external ID rejection.
- Persist valid transactions in PostgreSQL; repeated uploads are idempotent for external IDs.
- Filter by currency, category, and date range; paginate transactions.
- Compute income, expenses, net cash flow, monthly trends, and category summaries using SQL aggregation through Django ORM.
- Track incomplete category/merchant values and duplicate IDs in stored records.
- Export filtered records as CSV and inspect data-quality exceptions from imports.
- Responsive React dashboard with visualizations.

## Quick start — Docker
1. Copy `.env.example` to `.env` and adjust credentials.
2. Run `docker compose up --build`.
3. Open `http://localhost:5173`.
4. Import `sample_data/transactions.csv` from the dashboard.
5. API health check: `http://localhost:8000/api/health/`.

## Local development (without Docker)
Backend (Python 3.12+):
```bash
cd backend
python -m venv .venv
# Activate the environment for your OS
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
If DATABASE_URL is unset, the backend uses SQLite for local convenience. Docker uses PostgreSQL.
Frontend (Node.js 20+):
```bash
cd frontend
npm install
npm run dev
```
The Vite proxy defaults to `http://localhost:8000` outside Docker.

## API reference
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health/` | Health check |
| POST | `/api/upload/` | multipart/form-data `file` CSV upload |
| GET | `/api/transactions/` | Paginated transaction listing |
| GET | `/api/summary/` | SQL aggregate metrics and chart series |
| GET | `/api/quality/` | Missing-field and duplicate checks |
| GET | `/api/export/` | Filtered CSV download |

All GET analytics endpoints accept `currency`, `category`, `start`, `end` (ISO dates); transactions also accepts `page`.

### CSV format
Required header columns: `external_id,occurred_on,amount,currency,category,merchant`. Optional: `description`.
Dates: `YYYY-MM-DD`. Amount: **positive = inflow; negative = outflow**. Maximum 5 MB / 10,000 rows per upload. Invalid rows are rejected and summarized (first 100 issues returned).

### Quality behavior
- Missing mandatory CSV values are rejected before storage.
- Missing optional business information (`category`, `merchant`) can be flagged in stored records, but current import rejects empty required columns. Consequently, new imports cannot introduce those incomplete records; quality checks remain useful for legacy/externally inserted records.
- Duplicate IDs in a file and previously imported IDs are skipped. Existing database duplicates are reported if present.
- **Important:** Database-level uniqueness is not enforced in this demo, so concurrent uploads can race. Production should enforce unique constraints and choose an explicit source/account-scoped deduplication key.
- Multi-currency aggregation is not converted. Choose a single currency for meaningful totals.

## Testing
```bash
cd backend
python manage.py test
```
```bash
cd frontend
npm run build
```

## Security and production limitations
This is a **portfolio demo, not a banking or accounting system**. No authentication or authorization is implemented. Do not upload real customer or sensitive financial records. Use synthetic data only. For production add auth/RBAC, encrypted storage, audit logs, rate limits, database uniqueness constraints, financial reconciliation, background imports, secure secrets, and proper deployment with HTTPS and Gunicorn. No currency conversion or balance reconciliation is provided.

## Repository structure
- `backend/transactions/`: domain model, validation, APIs, and tests
- `backend/sql/analytics.sql`: hand-written PostgreSQL reporting queries
- `frontend/src/`: React dashboard and styling
- `sample_data/`: synthetic valid and invalid datasets
- `docs/`: architecture, requirements, and CV summary

## Suggested CV bullet (use after running and verifying)
Built a financial analytics dashboard using Django REST Framework, PostgreSQL, React, and TypeScript; implemented CSV ingestion, duplicate/missing-data checks, SQL-based cash-flow analytics, interactive visualizations, and downloadable reports.
