import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function LogoutComp() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    dispatch(logout());

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setTimeout(() => {
      navigate("/login");
    }, 1000);

  }, [dispatch, navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="text-center">

        <div
          className="spinner-border text-primary mb-3"
          role="status"
        ></div>

        <h3>Logging Out...</h3>

        <p className="text-muted">
          Redirecting to Login Page
        </p>

      </div>
    </div>
  );
}

