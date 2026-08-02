import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProductById,
    updateProduct
} from "../../api/productApi";

import { getAllCategories } from "../../api/categoryApi";

export default function EditProduct() {

    const { pid } = useParams();

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({

        cid: "",

        pname: "",

        pdesc: "",

        price: "",

        status: "",

        type: ""

    });

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const categoryResponse = await getAllCategories();

            setCategories(categoryResponse.data);

            const productResponse = await getProductById(pid);

            const product = productResponse.data;

            setFormData({

                cid: product.cid,

                pname: product.pname,

                pdesc: product.pdesc,

                price: product.price,

                status: product.status,

                type: product.type

            });

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

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

        try {

            await updateProduct(pid, formData);

            alert("Product Updated Successfully");

            navigate("/products");

        }

        catch (error) {

            alert("Unable to Update Product");

        }

    };

    if (loading) {

        return (

            <div className="text-center mt-5">

                <div className="spinner-border text-primary"></div>

            </div>

        );

    }

    return (

        <div className="container mt-5">

            <div className="card shadow">

                <div className="card-header bg-warning">

                    <h3>Edit Product</h3>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label>Product Name</label>

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

                            <label>Description</label>

                            <textarea
                                className="form-control"
                                rows="4"
                                name="pdesc"
                                value={formData.pdesc}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="row">

                            <div className="col-md-6">

                                <label>Price</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6">

                                <label>Category</label>

                                <select
                                    className="form-select"
                                    name="cid"
                                    value={formData.cid}
                                    onChange={handleChange}
                                >

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

                        <br/>

                        <div className="row">

                            <div className="col-md-6">

                                <label>Type</label>

                                <select
                                    className="form-select"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                >

                                    <option value="SELL">SELL</option>

                                    <option value="RENT">RENT</option>

                                </select>

                            </div>

                            <div className="col-md-6">

                                <label>Status</label>

                                <select
                                    className="form-select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >

                                    <option value="AVAILABLE">AVAILABLE</option>

                                    <option value="SOLD">SOLD</option>

                                    <option value="RENTED">RENTED</option>

                                </select>

                            </div>

                        </div>

                        <br/>

                        <button className="btn btn-warning">

                            Update Product

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}