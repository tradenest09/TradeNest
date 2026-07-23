import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminDashboard() {

  const auth = useSelector((state) => state.auth);

  return (
    <div className="container-fluid">

      {/* Top Navbar */}

      <div className="row bg-dark text-white p-3">

        <div className="col-md-6">
          <h3>TradeNest Admin Panel</h3>
        </div>

        <div className="col-md-6 text-end">
          Welcome {auth?.user?.username || "Admin"}
        </div>

      </div>

      {/* Dashboard Cards */}

      <div className="row p-4">

        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Total Users</h5>
            <h2>6</h2>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Total Assets</h5>
            <h2>3</h2>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Rentals</h5>
            <h2>0</h2>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Revenue</h5>
            <h2>₹0</h2>
          </div>
        </div>

      </div>

      {/* Main Content */}

      <div className="row">

        {/* Sidebar */}

        <div className="col-md-2">

          <div className="list-group">

            <NavLink
              className="list-group-item list-group-item-action"
              to="users"
            >
              Users
            </NavLink>

            <NavLink
              className="list-group-item list-group-item-action"
              to="assets"
            >
              Assets
            </NavLink>

            <NavLink
              className="list-group-item list-group-item-action"
              to="reports"
            >
              Reports
            </NavLink>

            <NavLink
              className="list-group-item list-group-item-action text-danger fw-bold"
              to="/logout"
            >
              Logout
            </NavLink>

          </div>

        </div>

        {/* Dynamic Content */}

        <div className="col-md-10">

          <div className="card p-4 shadow-sm">

            <Outlet />

          </div>

        </div>

      </div>

    </div>
  );
}