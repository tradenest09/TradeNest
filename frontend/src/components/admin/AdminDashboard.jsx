import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import { getTotalUsers } from "../../api/userApi";
import { getTotalProducts } from "../../api/productApi";

export default function AdminDashboard() {

  const auth = useSelector((state) => state.auth);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  // Load Dashboard Data
  const loadDashboard = async () => {

    try {

      const [userResponse, productResponse] = await Promise.all([
        getTotalUsers(),
        getTotalProducts()
      ]);

      setTotalUsers(userResponse.data);
      setTotalProducts(productResponse.data);

    } catch (error) {

      console.error("Failed to load dashboard:", error);

    }

  };

  useEffect(() => {

    loadDashboard();

  }, []);

  return (

    <div className="container-fluid">

      {/* Top Navbar */}

      <div className="row bg-dark text-white p-3">

        <div className="col-md-6">
          <h3>TradeNest Admin Panel</h3>
        </div>

        <div className="col-md-6 text-end">
          Welcome {auth?.user?.uname || "Admin"}
        </div>

      </div>

      {/* Dashboard Cards */}

      <div className="row p-4">

        <div className="col-md-3 mb-3">

          <div className="card shadow text-center p-3">

            <h5>Total Users</h5>

            <h2>{totalUsers}</h2>

          </div>

        </div>

        <div className="col-md-3 mb-3">

          <div className="card shadow text-center p-3">

            <h5>Total Assets</h5>

            <h2>{totalProducts}</h2>

          </div>

        </div>

        <div className="col-md-3 mb-3">

          <div className="card shadow text-center p-3">

            <h5>Total Orders</h5>

            <h2>0</h2>

          </div>

        </div>

        <div className="col-md-3 mb-3">

          <div className="card shadow text-center p-3">

            <h5>Revenue</h5>

            <h2>â‚¹0</h2>

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
              to="/admin/manage?tab=users"
            >
              Users
            </NavLink>

            <NavLink
              className="list-group-item list-group-item-action"
              to="/admin/manage?tab=products"
            >
              Assets
            </NavLink>

            <NavLink
              className="list-group-item list-group-item-action"
              to="/admin/reports"
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

            <p className="mb-0 text-muted">Select Users, Assets, or Reports to open the administration workspace.</p>

          </div>

        </div>

      </div>

    </div>

  );

}



