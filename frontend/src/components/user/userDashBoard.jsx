import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import BrowseAssets from "../product/BrowseAssets";
import AddAsset from "../product/AddAsset";

export default function UserDashboard() {

  const auth = useSelector((state) => state.auth);

  const [activePage, setActivePage] = useState("browse");

  return (
    <div className="container mt-5">

      <div className="d-flex justify-content-between align-items-center mb-3">

        <h2>
          Welcome {auth?.user?.fname || "User"}
        </h2>

        <Link
          to="/logout"
          className="btn btn-danger"
        >
          Logout
        </Link>

      </div>

      <hr />

      <div className="row">

        {/* Sidebar */}
        <div className="col-md-3">

          <div className="list-group">

            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActivePage("browse")}
            >
              Browse Assets
            </button>

            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActivePage("add")}
            >
              Add Asset
            </button>

            <button
              className="list-group-item list-group-item-action"
            >
              My Listings
            </button>

            <button
              className="list-group-item list-group-item-action"
            >
              Purchase History
            </button>

            <button
              className="list-group-item list-group-item-action"
            >
              Rental History
            </button>

            <Link
              to="/logout"
              className="list-group-item list-group-item-action text-danger fw-bold"
            >
              Logout
            </Link>

          </div>

        </div>

        {/* Content Area */}
        <div className="col-md-9">

          <div className="card p-4 shadow-sm">

            {
              activePage === "browse"
                ? <BrowseAssets />
                : <AddAsset />
            }

          </div>

        </div>

      </div>

    </div>
  );
}