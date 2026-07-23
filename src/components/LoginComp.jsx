import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function LoginComp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const reqoptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    };

    fetch("http://localhost:9000/login", reqoptions)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        } else {
          setMsg("Invalid Username or Password");
          return {};
        }
      })
      .then((data) => {
        if (!data.user) return;

        dispatch(
          login({
            user: data.user,
            token: data.token,
          })
        );

        if (data.user.role === 1) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      })
      .catch(() => {
        setMsg("Server Error. Please try again.");
      });
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">

        {/* Left Side */}
        <div className="col-md-6 d-none d-md-flex bg-primary text-white justify-content-center align-items-center">
          <div className="text-center p-5">
            <h1 className="display-4 fw-bold">TradeNest</h1>

            <p className="lead mt-3">
              Buy, Sell & Rent Assets with Confidence
            </p>

            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              alt="logo"
              className="img-fluid mt-4"
              style={{ maxWidth: "300px" }}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="col-md-6 d-flex justify-content-center align-items-center bg-light position-relative">

          {/* Home Link */}
          <div
            className="position-absolute"
            style={{
              top: "25px",
              left: "25px",
            }}
          >
            <Link
              to="/home"
              className="text-decoration-none fw-semibold"
            >
              ← Back to Home
            </Link>
          </div>

          <div
            className="card shadow-lg border-0 p-4"
            style={{
              width: "420px",
              borderRadius: "20px",
            }}
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold">
                Welcome Back
              </h2>

              <p className="text-muted">
                Login to continue to TradeNest
              </p>
            </div>

            {msg && (
              <div className="alert alert-danger">
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">
                  Username
                </label>

                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />

                  <label
                    className="form-check-label"
                    htmlFor="rememberMe"
                  >
                    Remember Me
                  </label>
                </div>

                <a
                  href="#"
                  className="text-decoration-none"
                >
                  Forgot Password?
                </a>

              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
              >
                Login
              </button>

            </form>

            <hr />

            <p className="text-center mb-0">
              Don't have an account?

              <Link
                to="/register"
                className="ms-2 text-decoration-none fw-bold"
              >
                Register
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}