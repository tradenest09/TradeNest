import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";

export default function RegisterComp() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        uname: "",
        password: "",
        email: "",
        contactNumber: "",
        fname: "",
        lname: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        try {

            await register(formData);

            setMessage("Registration Successful!");

            setTimeout(() => {

                navigate("/login");

            }, 1500);

        }
        catch (err) {

            if (err.response) {

                setError(err.response.data.message || "Registration Failed");

            }
            else {

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

                {/* Left */}

                <div className="col-md-6 bg-primary text-white d-none d-md-flex justify-content-center align-items-center">

                    <div className="text-center">

                        <h1 className="display-4 fw-bold">

                            TradeNest

                        </h1>

                        <p className="lead">

                            Create your account and start trading assets.

                        </p>

                    </div>

                </div>

                {/* Right */}

                <div className="col-md-6 d-flex justify-content-center align-items-center bg-light">

                    <div
                        className="card shadow-lg p-4 border-0"
                        style={{
                            width: "500px",
                            borderRadius: "20px"
                        }}
                    >

                        <h2 className="text-center mb-4">

                            Register

                        </h2>

                        {

                            message &&

                            <div className="alert alert-success">

                                {message}

                            </div>

                        }

                        {

                            error &&

                            <div className="alert alert-danger">

                                {error}

                            </div>

                        }

                        <form onSubmit={handleSubmit}>

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <label>First Name</label>

                                    <input

                                        type="text"

                                        name="fname"

                                        className="form-control"

                                        value={formData.fname}

                                        onChange={handleChange}

                                        required

                                    />

                                </div>

                                <div className="col-md-6 mb-3">

                                    <label>Last Name</label>

                                    <input

                                        type="text"

                                        name="lname"

                                        className="form-control"

                                        value={formData.lname}

                                        onChange={handleChange}

                                        required

                                    />

                                </div>

                            </div>

                            <div className="mb-3">

                                <label>Username</label>

                                <input

                                    type="text"

                                    name="uname"

                                    className="form-control"

                                    value={formData.uname}

                                    onChange={handleChange}

                                    required

                                />

                            </div>

                            <div className="mb-3">

                                <label>Email</label>

                                <input

                                    type="email"

                                    name="email"

                                    className="form-control"

                                    value={formData.email}

                                    onChange={handleChange}

                                    required

                                />

                            </div>

                            <div className="mb-3">

                                <label>Contact Number</label>

                                <input

                                    type="text"

                                    name="contactNumber"

                                    className="form-control"

                                    value={formData.contactNumber}

                                    onChange={handleChange}

                                    required

                                />

                            </div>

                            <div className="mb-4">

                                <label>Password</label>

                                <input

                                    type="password"

                                    name="password"

                                    className="form-control"

                                    value={formData.password}

                                    onChange={handleChange}

                                    required

                                />

                            </div>

                            <button

                                className="btn btn-success w-100"

                                disabled={loading}

                            >

                                {

                                    loading ?

                                        "Registering..." :

                                        "Register"

                                }

                            </button>

                        </form>

                        <hr />

                        <p className="text-center">

                            Already have an account?

                            <Link

                                to="/login"

                                className="ms-2 text-decoration-none"

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