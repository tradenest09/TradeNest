import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { addProduct } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";

import AlertMessage from "../common/AlertMessage";

export default function AddProduct() {

    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({

        uid: user.uid,

        cid: "",

        pname: "",

        pdesc: "",

        price: "",

        status: "AVAILABLE",

        type: "SELL"

    });

   const [loading,setLoading]=useState(false);

    const [success,setSuccess]=useState("");

    const [error,setError]=useState("");

    useEffect(() => {

        loadCategories();

    }, []);

    const loadCategories = async () => {

        try {

            const response = await getAllCategories();

            setCategories(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await addProduct(formData);

            setSuccess("Product Added Successfully");

            navigate("/products");

        }

        catch (error) {

            setError("Unable to Add Product");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="container mt-5">

            <div className="card shadow">

                <div className="card-header bg-primary text-white">

                    <h3>Add Product</h3>

                </div>

                <div className="card-body">

    <AlertMessage
        type="success"
        message={success}
        onClose={() => setSuccess("")}
    />

    <AlertMessage
        type="danger"
        message={error}
        onClose={() => setError("")}
    />

    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">

                                Product Name

                            </label>

                            <input

                                type="text"

                                className="form-control"

                                name="pname"

                                value={formData.pname}

                                onChange={handleChange}

                                required

                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">

                                Description

                            </label>

                            <textarea

                                className="form-control"

                                rows="4"

                                name="pdesc"

                                value={formData.pdesc}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label>

                                    Price

                                </label>

                                <input

                                    type="number"

                                    className="form-control"

                                    name="price"

                                    value={formData.price}

                                    onChange={handleChange}

                                    required

                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>

                                    Category

                                </label>

                                <select

                                    className="form-select"

                                    name="cid"

                                    value={formData.cid}

                                    onChange={handleChange}

                                    required

                                >

                                    <option value="">

                                        Select Category

                                    </option>

                                    {

                                        categories.map(category => (

                                            <option

                                                key={category.cid}

                                                value={category.cid}

                                            >

                                                {category.cname}

                                            </option>

                                        ))

                                    }

                                </select>

                            </div>

                        </div>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label>

                                    Product Type

                                </label>

                                <select

                                    className="form-select"

                                    name="type"

                                    value={formData.type}

                                    onChange={handleChange}

                                >

                                    <option value="SELL">

                                        SELL

                                    </option>

                                    <option value="RENT">

                                        RENT

                                    </option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>

                                    Status

                                </label>

                                <select

                                    className="form-select"

                                    name="status"

                                    value={formData.status}

                                    onChange={handleChange}

                                >

                                    <option value="AVAILABLE">

                                        AVAILABLE

                                    </option>

                                    <option value="SOLD">

                                        SOLD

                                    </option>

                                    <option value="RENTED">

                                        RENTED

                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* Future Image Upload */}

                        <div className="mb-4">

                            <label className="form-label">

                                Product Images

                            </label>

                            <input

                                type="file"

                                className="form-control"

                                disabled

                            />

                            <small className="text-muted">

                                Image Upload Coming Soon

                            </small>

                        </div>

                        <button

                            className="btn btn-success"

                            disabled={loading}

                        >

                            {

                                loading ?

                                    "Saving..." :

                                    "Add Product"

                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}