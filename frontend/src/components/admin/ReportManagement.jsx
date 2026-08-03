import { useEffect, useState } from "react";
import { getAllReports, updateReportStatus } from "../../api/reportApi";

const statuses = ["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"];

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await getAllReports();
      setReports(response.data);
    } catch {
      setError("Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReports(); }, []);

  const changeStatus = async (reportId, status) => {
    setSaving(reportId);
    setError("");
    try {
      const response = await updateReportStatus(reportId, status);
      setReports((current) => current.map((report) =>
        report.reportId === reportId ? response.data : report
      ));
    } catch {
      setError("Unable to update the report status.");
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" /></div>;

  return <div className="container mt-5">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div><h2>Reports</h2><p className="text-muted mb-0">Review and resolve product reports.</p></div>
      <button className="btn btn-outline-primary" onClick={loadReports}>Refresh</button>
    </div>
    {error && <div className="alert alert-danger">{error}</div>}
    <div className="card shadow-sm p-3">
      {reports.length === 0 ? <div className="alert alert-info mb-0">No reports found.</div> :
        <div className="table-responsive"><table className="table align-middle mb-0">
          <thead><tr><th>ID</th><th>Product</th><th>Reporter</th><th>Reason</th><th>Description</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>{reports.map((report) => <tr key={report.reportId}>
            <td>#{report.reportId}</td><td>#{report.pid}</td><td>#{report.reporterId}</td>
            <td>{report.reason}</td><td>{report.description || "—"}</td>
            <td>{report.reportDate ? new Date(report.reportDate).toLocaleDateString() : "—"}</td>
            <td><select className="form-select form-select-sm" value={report.status} disabled={saving === report.reportId}
              onChange={(event) => changeStatus(report.reportId, event.target.value)}>
              {statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
            </select></td>
          </tr>)}</tbody>
        </table></div>}
    </div>
  </div>;
}
