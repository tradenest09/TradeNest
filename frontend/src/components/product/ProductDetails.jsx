import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../api/productApi";

export default function ProductDetails() {

    const { pid } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadProduct();

    }, []);

    const loadProduct = async () => {

        try {

            const response = await getProductById(pid);

            setProduct(response.data);

        }
        catch (err) {

            console.log(err);

        }
        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="container text-center mt-5">

                <div className="spinner-border text-primary"></div>

            </div>

        );

    }

    if (!product) {

        return (

            <div className="container mt-5">

                <div className="alert alert-danger">

                    Product Not Found

                </div>

            </div>

        );

    }

    return (

        <div className="container mt-5">

            <div className="card shadow-lg border-0">

                <div className="row">

                    {/* Image Placeholder */}

                    <div className="col-md-5">

                        <div
                            className="d-flex justify-content-center align-items-center bg-light"
                            style={{
                                height: "400px"
                            }}
                        >

                            <i
                                className="bi bi-image"
                                style={{
                                    fontSize: "120px",
                                    color: "#bdbdbd"
                                }}
                            ></i>

                        </div>

                    </div>

                    {/* Product Info */}

                    <div className="col-md-7">

                        <div className="card-body">

                            <h2>

                                {product.pname}

                            </h2>

                            <hr />

                            <h3 className="text-success">

                                ₹ {product.price}

                            </h3>

                            <p>

                                <strong>Category :</strong>

                                {" "}

                                {product.categoryName}

                            </p>

                            <p>

                                <strong>Description :</strong>

                                {" "}

                                {product.pdesc}

                            </p>

                            <p>

                                <strong>Status :</strong>

                                {" "}

                                {product.status}

                            </p>

                            <p>

                                <strong>Type :</strong>

                                {" "}

                                {product.type}

                            </p>

                            <p>

                                <strong>Seller Id :</strong>

                                {" "}

                                {product.uid}

                            </p>

                            <p>

                                <strong>Added On :</strong>

                                {" "}

                                {

                                    new Date(product.createdAt)

                                        .toLocaleString()

                                }

                            </p>

                            <hr />

                            {

                                product.type === "SELL"

                                ?

                                <button
                                    className="btn btn-success btn-lg me-3"
                                >

                                    Buy Now

                                </button>

                                :

                                <button
                                    className="btn btn-warning btn-lg me-3"
                                >

                                    Rent Now

                                </button>

                            }

                            <Link
                                to="/products"
                                className="btn btn-secondary btn-lg"
                            >

                                Back

                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}