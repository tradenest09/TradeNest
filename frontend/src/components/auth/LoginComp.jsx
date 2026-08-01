import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "../../api/authApi";

export default function LoginComp() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const response = await loginApi({
        email,
        password
      });

      const data = response.data;

      dispatch(
        login({
          token: data.token,
          user: {
            uid: data.uid,
            uname: data.uname,
            email: data.email,
            contactNumber: data.contactNumber,
            fname: data.fname,
            lname: data.lname,
            role: data.role,
            status: data.status
          }
        })
      );

      if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    }
    catch (err) {

      if (err.response) {
        setError(err.response.data.message || "Invalid Email or Password");
      } else {
        setError("Unable to connect to server.");
      }

    }
    finally {
      setLoading(false);
    }

  };

  return (

    <div className="container-fluid min-vh-100">

      <div className="row min-vh-100">

        {/* Left Section */}

        <div className="col-md-6 bg-primary text-white d-none d-md-flex justify-content-center align-items-center">

          <div className="text-center">

            <h1 className="display-4 fw-bold">

              TradeNest

            </h1>

            <p className="lead mt-3">

              Buy • Sell • Rent Assets Securely

            </p>

            <img

              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"

              alt="TradeNest"

              className="img-fluid mt-4"

              style={{ maxWidth: "300px" }}

            />

          </div>

        </div>

        {/* Right Section */}

        <div className="col-md-6 d-flex justify-content-center align-items-center bg-light">

          <div

            className="card shadow-lg border-0 p-4"

            style={{

              width: "430px",

              borderRadius: "20px"

            }}

          >

            <div className="text-center mb-4">

              <h2 className="fw-bold">

                Welcome Back

              </h2>

              <p className="text-muted">

                Login to continue

              </p>

            </div>

            {

              error &&

              <div className="alert alert-danger">

                {error}

              </div>

            }

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label">

                  Email

                </label>

                <input

                  type="email"

                  className="form-control form-control-lg"

                  placeholder="Enter Email"

                  value={email}

                  onChange={(e) => setEmail(e.target.value)}

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

                  onChange={(e) => setPassword(e.target.value)}

                  required

                />

              </div>

              <button

                className="btn btn-primary btn-lg w-100"

                disabled={loading}

              >

                {

                  loading ?

                    "Logging In..." :

                    "Login"

                }

              </button>

            </form>

            <hr />

            <p className="text-center">

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