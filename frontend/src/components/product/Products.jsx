import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllProducts } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";

import ProductCard from "./ProductCard";

export default function Products() {

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadData();

    }, []);

    useEffect(() => {

        filterProducts();

    }, [search, category, type, products]);

    const loadData = async () => {

        try {

            const productResponse = await getAllProducts();

            const categoryResponse = await getAllCategories();

            setProducts(productResponse.data);

            setFilteredProducts(productResponse.data);

            setCategories(categoryResponse.data);

        }
        catch (error) {

            console.log(error);

        }
        finally {

            setLoading(false);

        }

    };

    const filterProducts = () => {

        let data = [...products];

        if (search.trim() !== "") {

            data = data.filter(product =>
                product.pname
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );

        }

        if (category !== "") {

            data = data.filter(product =>
                product.cid === Number(category)
            );

        }

        if (type !== "") {

            data = data.filter(product =>
                product.type === type
            );

        }

        setFilteredProducts(data);

    };

    if (loading) {

        return (

            <div className="text-center mt-5">

                <div className="spinner-border text-primary"></div>

            </div>

        );

    }

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>

                    TradeNest Marketplace

                </h2>

                <Link
                    to="/products/add"
                    className="btn btn-primary"
                >

                    + Add Product

                </Link>

            </div>

            {/* Search */}

            <div className="row mb-4">

                <div className="col-md-4">

                    <input

                        type="text"

                        className="form-control"

                        placeholder="Search Products"

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                    />

                </div>

                <div className="col-md-4">

                    <select

                        className="form-select"

                        value={category}

                        onChange={(e) =>
                            setCategory(e.target.value)
                        }

                    >

                        <option value="">

                            All Categories

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

                <div className="col-md-4">

                    <select

                        className="form-select"

                        value={type}

                        onChange={(e) =>
                            setType(e.target.value)
                        }

                    >

                        <option value="">

                            All Types

                        </option>

                        <option value="SELL">

                            SELL

                        </option>

                        <option value="RENT">

                            RENT

                        </option>

                    </select>

                </div>

            </div>

            {

                filteredProducts.length === 0 ?

                    <div className="alert alert-warning">

                        No Products Found

                    </div>

                    :

                    <div className="row">

                        {

                            filteredProducts.map(product => (

                                <div
                                    className="col-lg-4 col-md-6 mb-4"
                                    key={product.pid}
                                >

                                    <ProductCard
                                        product={product}
                                    />

                                </div>

                            ))

                        }

                    </div>

            }

        </div>

    );

}