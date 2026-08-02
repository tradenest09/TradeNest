import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../api/productApi";

export default function FeaturedProducts() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        loadProducts();

    }, []);

    const loadProducts = async () => {

        try {

            const response = await getAllProducts();

            // Display only first 6 products
            setProducts(response.data.slice(0, 6));

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container my-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Featured Products</h2>

                <Link
                    to="/products"
                    className="btn btn-outline-primary"
                >
                    View All
                </Link>

            </div>

            <div className="row">

                {

                    products.map(product => (

                        <div
                            className="col-lg-4 col-md-6 mb-4"
                            key={product.pid}
                        >

                            <div className="card shadow h-100">

                                <div
                                    className="bg-light d-flex justify-content-center align-items-center"
                                    style={{ height: "180px" }}
                                >

                                    <h1>📦</h1>

                                </div>

                                <div className="card-body">

                                    <h5>{product.pname}</h5>

                                    <p className="text-muted">

                                        {product.categoryName}

                                    </p>

                                    <h4 className="text-success">

                                        {new Intl.NumberFormat("en-IN", {
                                            style: "currency",
                                            currency: "INR",
                                        }).format(product.price)}

                                    </h4>

                                    <span className="badge bg-primary me-2">

                                        {product.type}

                                    </span>

                                    <span className="badge bg-success">

                                        {product.status}

                                    </span>

                                </div>

                                <div className="card-footer bg-white">

                                    <Link
                                        to={`/products/${product.pid}`}
                                        className="btn btn-primary w-100"
                                    >

                                        View Details

                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}