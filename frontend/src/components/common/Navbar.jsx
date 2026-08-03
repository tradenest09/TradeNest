import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";

export default function Navbar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {

        dispatch(logout());

        navigate("/login");

    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">

            <div className="container">

                <Link className="navbar-brand fw-bold" to="/">

                    TradeNest

                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >

                    <span className="navbar-toggler-icon"></span>

                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarNav"
                >

                    <ul className="navbar-nav me-auto">

                        <li className="nav-item">

                            <Link className="nav-link" to="/">

                                Home

                            </Link>

                        </li>

                        {

                            isAuthenticated && (

                                <>

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/products"
                                        >

                                            Marketplace

                                        </Link>

                                    </li>

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/dashboard"
                                        >

                                            My Products

                                        </Link>

                                    </li>

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/dashboard"
                                        >

                                            Purchases

                                        </Link>

                                    </li>

                                </>

                            )

                        }

                        {

                            isAuthenticated &&
                            user.role === "ADMIN" &&

                            <li className="nav-item">

                                <Link
                                    className="nav-link"
                                    to="/admin/manage"
                                >

                                    Admin

                                </Link>

                            </li>

                        }

                    </ul>

                    <ul className="navbar-nav">

                        {

                            !isAuthenticated ?

                                <>

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/login"
                                        >

                                            Login

                                        </Link>

                                    </li>

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/register"
                                        >

                                            Register

                                        </Link>

                                    </li>

                                </>

                                :

                                <>

                                    <li className="nav-item">

                                        <span className="navbar-text me-3">

                                            Welcome,

                                            {" "}

                                            <strong>

                                                {user.fname} {user.lname}

                                            </strong>

                                        </span>

                                    </li>

                                    <li className="nav-item">

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={handleLogout}
                                        >

                                            Logout

                                        </button>

                                    </li>

                                </>

                        }

                    </ul>

                </div>

            </div>

        </nav>

    );

}
