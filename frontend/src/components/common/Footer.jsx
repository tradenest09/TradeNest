import { Link } from "react-router-dom";

export default function Footer() {

    return (

        <footer className="bg-dark text-light mt-5">

            <div className="container py-5">

                <div className="row">

                    {/* About */}

                    <div className="col-md-4">

                        <h4 className="fw-bold">

                            TradeNest

                        </h4>

                        <p>

                            Buy, Sell and Rent assets securely with trusted users.

                        </p>

                    </div>

                    {/* Quick Links */}

                    <div className="col-md-4">

                        <h5>

                            Quick Links

                        </h5>

                        <ul className="list-unstyled">

                            <li>

                                <Link
                                    className="text-light text-decoration-none"
                                    to="/"
                                >
                                    Home
                                </Link>

                            </li>

                            <li>

                                <Link
                                    className="text-light text-decoration-none"
                                    to="/products"
                                >
                                    Marketplace
                                </Link>

                            </li>

                            <li>

                                <Link
                                    className="text-light text-decoration-none"
                                    to="/my-products"
                                >
                                    My Products
                                </Link>

                            </li>

                            <li>

                                <Link
                                    className="text-light text-decoration-none"
                                    to="/login"
                                >
                                    Login
                                </Link>

                            </li>

                        </ul>

                    </div>

                    {/* Contact */}

                    <div className="col-md-4">

                        <h5>

                            Contact

                        </h5>

                        <p>

                            Email : support@tradenest.com

                        </p>

                        <p>

                            Pune, Maharashtra

                        </p>

                    </div>

                </div>

                <hr />

                <div className="text-center">

                    © 2026 TradeNest | All Rights Reserved

                </div>

            </div>

        </footer>

    );

}