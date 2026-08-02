import { Link } from "react-router-dom";

import FeaturedProducts from "./FeaturedProducts";

export default function HomeComp() {

    return (

        <>

            {/* Hero Section */}

            <div className="bg-dark text-white py-5">

                <div className="container text-center">

                    <h1 className="display-4 fw-bold">

                        Welcome to TradeNest

                    </h1>

                    <p className="lead mt-3">

                        Buy • Sell • Rent Assets Securely

                    </p>

                    <p>

                        Your Smart Asset Marketplace powered by secure authentication and trusted transactions.

                    </p>

                    <div className="mt-4">

                        <Link
                            to="/products"
                            className="btn btn-primary btn-lg me-3"
                        >

                            Browse Products

                        </Link>

                        <Link
                            to="/products/add"
                            className="btn btn-outline-light btn-lg"
                        >

                            Sell Product

                        </Link>

                    </div>

                </div>

            </div>

            {/* Features */}

            <div className="container my-5">

                <h2 className="text-center mb-5">

                    Why Choose TradeNest?

                </h2>

                <div className="row text-center">

                    <div className="col-md-3">

                        <div className="card shadow h-100">

                            <div className="card-body">

                                <h1>🔒</h1>

                                <h5>Secure</h5>

                                <p>

                                    JWT Authentication & Secure Access

                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card shadow h-100">

                            <div className="card-body">

                                <h1>📦</h1>

                                <h5>Marketplace</h5>

                                <p>

                                    Buy, Sell and Rent Assets Easily

                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card shadow h-100">

                            <div className="card-body">

                                <h1>📱</h1>

                                <h5>QR Tracking</h5>

                                <p>

                                    Smart Asset Tracking with QR Codes

                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div className="card shadow h-100">

                            <div className="card-body">

                                <h1>🤝</h1>

                                <h5>Trusted Users</h5>

                                <p>

                                    Verified Buyers and Sellers

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
               
            <FeaturedProducts />
            
            {/* Categories */}

            <div className="bg-light py-5">

                <div className="container">

                    <h2 className="text-center mb-5">

                        Browse Categories

                    </h2>

                    <div className="row text-center">

                        {

                            [

                                "Electronics",

                                "Furniture",

                                "Vehicles",

                                "Books",

                                "Sports",

                                "Fashion"

                            ].map(category => (

                                <div
                                    className="col-md-2 col-6 mb-4"
                                    key={category}
                                >

                                    <div className="card shadow-sm">

                                        <div className="card-body">

                                            <h5>{category}</h5>

                                        </div>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                </div>

            </div>

            {/* Call to Action */}

            <div className="container text-center my-5">

                <h2>

                    Ready to Start Trading?

                </h2>

                <p className="lead">

                    Join TradeNest and experience secure asset trading.

                </p>

                <Link
                    to="/register"
                    className="btn btn-success btn-lg"
                >

                    Create Account

                </Link>

            </div>

        </>

    );

}