import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getProductsBySeller } from "../../api/productApi";

import ProductCard from "./ProductCard";

export default function MyProducts() {

    const { user } = useSelector((state) => state.auth);

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadProducts();

    }, []);

    const loadProducts = async () => {

        try {

            const response = await getProductsBySeller(user.uid);

            setProducts(response.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

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

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>

                    My Products

                </h2>

            </div>

            {

                products.length === 0 ?

                    <div className="alert alert-info">

                        You haven't added any products yet.

                    </div>

                    :

                    <div className="row">

                        {

                            products.map(product => (

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