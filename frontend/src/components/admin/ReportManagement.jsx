import { useEffect, useState } from "react";
import { getAllReports, updateReportStatus } from "../../api/reportApi";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";

const statuses = ["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"];

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await getAllReports();
      setReports(response.data);
    } catch {
      toast.error("Unable to load system reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReports(); }, []);

  const changeStatus = async (reportId, status) => {
    setSaving(reportId);
    try {
      const response = await updateReportStatus(reportId, status);
      setReports((current) => current.map((report) => report.reportId === reportId ? response.data : report));
      toast.success("Report status updated.");
    } catch {
      toast.error("Unable to update the report status.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="container-fluid py-2">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Link to="/admin" className="btn btn-light rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center text-main hover-primary" style={{ width: '40px', height: '40px' }}>
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h4 className="fw-bold mb-0">System Reports</h4>
            <p className="text-muted small mb-0">Review and resolve reported platform issues.</p>
          </div>
          <button className="btn btn-outline-primary fw-bold px-4 ms-auto d-flex align-items-center gap-2" onClick={loadReports} disabled={loading}>
            <FiRefreshCw className={loading ? "spin" : ""} /> Refresh Data
          </button>
        </div>

        <div className="card-custom bg-white border-0 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-5">
              <FiAlertCircle size={48} className="text-muted mb-3" />
              <h5 className="fw-bold">No Reports Found</h5>
              <p className="text-muted mb-0">The system is completely clean.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table-clean">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Asset ID</th>
                    <th>Reporter</th>
                    <th>Reason</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.reportId}>
                      <td><span className="fw-bold text-primary">#{report.reportId}</span></td>
                      <td><Link to={`/products/${report.pid}`} className="text-decoration-none fw-bold text-main">#{report.pid}</Link></td>
                      <td className="fw-bold">#{report.reporterId}</td>
                      <td><span className="badge bg-danger-subtle text-danger border border-danger fw-bold">{report.reason}</span></td>
                      <td className="text-muted" style={{ maxWidth: '200px' }} title={report.description}>
                        <div className="text-truncate">{report.description || "—"}</div>
                      </td>
                      <td className="text-muted">{report.reportDate ? new Date(report.reportDate).toLocaleDateString() : "—"}</td>
                      <td>
                        <select 
                          className={`form-select form-select-sm fw-bold ${report.status === 'RESOLVED' ? 'text-success bg-success-subtle border-success' : 'text-primary bg-primary-subtle border-primary'}`} 
                          value={report.status} 
                          disabled={saving === report.reportId}
                          onChange={(e) => changeStatus(report.reportId, e.target.value)}
                        >
                          {statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
