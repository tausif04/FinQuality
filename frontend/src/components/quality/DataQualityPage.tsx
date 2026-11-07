import { AlertTriangle, Database, Search, ShieldCheck } from "lucide-react";
import type { Quality } from "../../types";
import MetricCard from "../common/MetricCard";

interface DataQualityPageProps {
  quality: Quality | null;
  onRefresh: () => void;
}

export default function DataQualityPage({
  quality,
  onRefresh,
}: DataQualityPageProps) {
  const duplicateSamples = quality?.duplicate_samples ?? [];

  return (
    <section className="page-content">
      <div className="page-heading">
        <div>
          <h2>Validation Overview</h2>
          <p className="muted">
            Review completeness and duplicate identifier signals.
          </p>
        </div>

        <button className="btn refresh" onClick={onRefresh}>
          <ShieldCheck size={16} />
          Refresh Analysis
        </button>
      </div>

      <div className="metrics">
        <MetricCard
          title="Records Analyzed"
          value={String(quality?.total_records ?? 0)}
          icon={<Database size={20} />}
          note="Records in current filter"
        />
        <MetricCard
          title="Missing Optional Fields"
          value={String(quality?.missing_optional_fields ?? 0)}
          icon={<AlertTriangle size={20} />}
          note="Missing category / merchant"
        />
        <MetricCard
          title="Duplicate ID Groups"
          value={String(quality?.duplicate_id_groups ?? 0)}
          icon={<Search size={20} />}
          note="Repeated transaction IDs"
        />
        <MetricCard
          title="Duplicate Samples"
          value={String(duplicateSamples.length)}
          icon={<Database size={20} />}
          note="Examples returned by API"
        />
      </div>

      <div className="panel quality-panel">
        <div className="panel-head">
          <div>
            <h2>Data Quality Details</h2>
            <p className="muted">
              Validation statistics returned by the backend.
            </p>
          </div>
          <span className="pill">Quality Report</span>
        </div>

        <div className="quality-details">
          <div className="quality-detail-row">
            <div>
              <strong>Missing Optional Fields</strong>
              <p className="muted">
                Records with a missing category or merchant value.
              </p>
            </div>
            <span className="quality-value">
              {quality?.missing_optional_fields ?? 0}
            </span>
          </div>

          <div className="quality-detail-row">
            <div>
              <strong>Duplicate Transaction IDs</strong>
              <p className="muted">
                Groups of repeated transaction identifiers.
              </p>
            </div>
            <span className="quality-value">
              {quality?.duplicate_id_groups ?? 0}
            </span>
          </div>

          <div className="quality-detail-row">
            <div>
              <strong>Total Records Analyzed</strong>
              <p className="muted">
                Records included in this quality response.
              </p>
            </div>
            <span className="quality-value">
              {quality?.total_records ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div className="panel duplicate-panel">
        <div className="panel-head">
          <div>
            <h2>Duplicate Transaction Samples</h2>
            <p className="muted">
              Duplicate identifiers exposed by the quality API.
            </p>
          </div>
          <AlertTriangle size={20} color="#f59e0b" />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Occurrences</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {duplicateSamples.map((duplicate, index) => (
                <tr key={`${duplicate.external_id}-${index}`}>
                  <td className="mono">{duplicate.external_id}</td>
                  <td>{duplicate.n}</td>
                  <td>
                    <span className="quality-warning">
                      Duplicate detected
                    </span>
                  </td>
                </tr>
              ))}

              {duplicateSamples.length === 0 && (
                <tr>
                  <td colSpan={3} className="empty">
                    No duplicate ID samples were returned by the API.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="quality-info">
        <AlertTriangle size={20} />
        <div>
          <strong>Validation information</strong>
          <p>
            The import process reports malformed rows and duplicate IDs.
            Missing optional fields are counted separately by the quality
            endpoint. Review the CSV import response for rejected-row details.
          </p>
        </div>
      </div>
    </section>
  );
}
