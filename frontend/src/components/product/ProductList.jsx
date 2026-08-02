import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    setLoading,
    setProducts,
    setError
} from "../../redux/productSlice";

import { getAllProducts } from "../../api/productApi";

import ProductCard from "./ProductCard";

export default function ProductList() {

    const dispatch = useDispatch();

    const {
        products,
        loading,
        error
    } = useSelector((state) => state.product);

    useEffect(() => {

        loadProducts();

    }, []);

    const loadProducts = async () => {

        dispatch(setLoading());

        try {

            const response = await getAllProducts();

            dispatch(setProducts(response.data));

        }
        catch (err) {

            dispatch(setError("Unable to load products"));

        }

    };

    if (loading) {

        return (

            <div className="container mt-5 text-center">

                <div className="spinner-border text-primary"></div>

                <h5 className="mt-3">
                    Loading Products...
                </h5>

            </div>

        );

    }

    if (error) {

        return (

            <div className="container mt-5">

                <div className="alert alert-danger">

                    {error}

                </div>

            </div>

        );

    }

    return (

        <div className="container mt-4">

            <h2 className="mb-4">

                All Products

            </h2>

            {

                products.length === 0 ?

                    <div className="alert alert-info">

                        No Products Available

                    </div>

                    :

                    <div className="row">

                        {

                            products.map((product) => (

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