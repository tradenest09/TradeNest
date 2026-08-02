import { Link } from "react-router-dom";
import { deleteProduct } from "../../api/productApi";

export default function ProductCard({ product }) {

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {

            await deleteProduct(product.pid);

            alert("Product deleted successfully.");

            window.location.reload();

        } catch (error) {

            alert("Unable to delete product.");

        }

    };

    return (

        <div className="card shadow h-100 border-0">

            {/* Image Placeholder */}
            <div
                className="d-flex justify-content-center align-items-center bg-light"
                style={{ height: "220px" }}
            >

                <i
                    className="bi bi-image"
                    style={{
                        fontSize: "60px",
                        color: "#b0b0b0"
                    }}
                ></i>

            </div>

            <div className="card-body">

                <h5 className="fw-bold">

                    {product.pname}

                </h5>

                <p className="text-muted mb-1">

                    <strong>Category :</strong> {product.categoryName}

                </p>

                <p
                    className="text-secondary"
                    style={{
                        height: "50px",
                        overflow: "hidden"
                    }}
                >

                    {product.pdesc}

                </p>

                <h4 className="text-success">

                    ₹ {product.price}

                </h4>

                <div className="mb-2">

                    <span className="badge bg-primary me-2">

                        {product.type}

                    </span>

                    <span className="badge bg-success">

                        {product.status}

                    </span>

                </div>

                <small className="text-muted">

                    Added :
                    {" "}
                    {new Date(product.createdAt).toLocaleDateString()}

                </small>

            </div>

            <div className="card-footer bg-white border-0">

                <div className="d-grid gap-2">

                    <Link
                        to={`/products/${product.pid}`}
                        className="btn btn-outline-primary"
                    >
                        View Details
                    </Link>

                    <Link
                        to={`/products/edit/${product.pid}`}
                        className="btn btn-warning"
                    >
                        Edit
                    </Link>

                    <button
                        className="btn btn-danger"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}