import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterComp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    contactnumber: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:9000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.status === 201) {
          setMsg("Registration Successful");

          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          setMsg("Registration Failed");
        }
      })
      .catch(() => {
        setMsg("Something went wrong");
      });
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">

        {/* Left Side */}
        <div className="col-md-6 d-none d-md-flex bg-primary text-white justify-content-center align-items-center">
          <div className="text-center p-5">

            <h1 className="display-3 fw-bold">
              TradeNest
            </h1>

            <p className="lead mt-3">
              Join the Smart Marketplace
            </p>

            <h5 className="mt-4 fw-bold">
              Buy • Sell • Rent Assets
            </h5>

            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              alt="TradeNest Logo"
              className="img-fluid mt-4"
              style={{
                maxWidth: "300px",
              }}
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
              width: "500px",
              borderRadius: "20px",
            }}
          >
            <div className="text-center mb-4">

              <h2 className="fw-bold">
                Create Account
              </h2>

              <p className="text-muted">
                Start your journey with TradeNest
              </p>

            </div>

            {msg && (
              <div
                className={`alert ${
                  msg.includes("Successful")
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    className="form-control form-control-lg"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    className="form-control form-control-lg"
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="form-control form-control-lg"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="form-control form-control-lg"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="contactnumber"
                  placeholder="Mobile Number"
                  className="form-control form-control-lg"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control form-control-lg"
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                className="btn btn-primary btn-lg w-100"
                type="submit"
              >
                Create Account
              </button>

            </form>

            <hr />

            <p className="text-center mb-0">
              Already have an account?

              <Link
                to="/login"
                className="ms-2 fw-bold text-decoration-none"
              >
                Login
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}