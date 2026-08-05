import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getTotalUsers } from "../../api/userApi";
import { getTotalProducts } from "../../api/productApi";
import { FiUsers, FiBox, FiShoppingCart, FiDollarSign, FiLogOut, FiFileText, FiShield } from "react-icons/fi";

export default function AdminDashboard() {
  const auth = useSelector((state) => state.auth);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [userRes, prodRes] = await Promise.all([getTotalUsers(), getTotalProducts()]);
        setTotalUsers(userRes.data);
        setTotalProducts(prodRes.data);
      } catch (error) { console.error("Failed to load dashboard:", error); }
    }
    loadDashboard();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar d-none d-md-flex pb-4">
        <div className="p-4 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: '60px', height: '60px' }}>
              {auth?.user?.fname?.charAt(0) || "A"}
            </div>
            <div>
              <h6 className="fw-bold mb-0 text-main">Administrator</h6>
              <span className="text-danger small fw-bold">System Control</span>
            </div>
          </div>
        </div>
        
        <div className="flex-grow-1 py-3">
          <div className="px-4 py-2 mb-1 text-uppercase small fw-bold text-muted" style={{ fontSize: '11px' }}>Core</div>
          <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiShield size={18} /> Control Panel
          </NavLink>
          
          <div className="px-4 py-2 mt-3 mb-1 text-uppercase small fw-bold text-muted" style={{ fontSize: '11px' }}>Management</div>
          <NavLink to="/admin/manage?tab=users" className="sidebar-link">
            <FiUsers size={18} /> Manage Users
          </NavLink>
          <NavLink to="/admin/manage?tab=products" className="sidebar-link">
            <FiBox size={18} /> Manage Assets
          </NavLink>
          
          <div className="px-4 py-2 mt-3 mb-1 text-uppercase small fw-bold text-muted" style={{ fontSize: '11px' }}>System</div>
          <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FiFileText size={18} /> Reports
          </NavLink>
        </div>
        
        <div className="mt-auto border-top p-3">
          <NavLink to="/logout" className="sidebar-link text-danger w-100" style={{ borderLeft: 'none' }}>
            <FiLogOut size={18} /> Secure Logout
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h3 className="fw-bold mb-1">Platform Overview</h3>
              <p className="text-muted mb-0">Monitor platform metrics and activity in real-time.</p>
            </div>
          </div>

          <div className="row g-4 mb-5">
            {[
              { title: "Total Users", value: totalUsers, icon: <FiUsers size={24} />, bg: "rgba(37, 99, 235, 0.1)", color: "var(--primary-color)" },
              { title: "Total Listings", value: totalProducts, icon: <FiBox size={24} />, bg: "rgba(16, 185, 129, 0.1)", color: "var(--secondary-color)" },
              { title: "Total Transactions", value: "0", icon: <FiShoppingCart size={24} />, bg: "rgba(245, 158, 11, 0.1)", color: "var(--accent-color)" },
              { title: "Platform Revenue", value: "₹0", icon: <FiDollarSign size={24} />, bg: "rgba(239, 68, 68, 0.1)", color: "var(--danger-color)" }
            ].map((stat, idx) => (
              <div className="col-xl-3 col-md-6" key={idx}>
                <div className="card-custom bg-white p-4 border-0 shadow-sm d-flex flex-row align-items-center gap-4 h-100">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '64px', height: '64px', backgroundColor: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div>
                    <h6 className="text-muted small fw-bold text-uppercase mb-1">{stat.title}</h6>
                    <h3 className="fw-bold text-main mb-0">{stat.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-custom bg-white border-0 shadow-sm overflow-hidden mb-4">
            <div className="p-4 border-bottom">
              <h5 className="fw-bold mb-0">System Alerts & Notices</h5>
            </div>
            <div className="p-5 text-center">
              <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <FiShield size={32} className="text-muted" />
              </div>
              <h5 className="fw-bold">All systems operational</h5>
              <p className="text-muted mb-0">Use the sidebar navigation to moderate users, assets, or resolve system reports.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
