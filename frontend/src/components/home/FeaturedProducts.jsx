import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../api/productApi";
import ProductCard from "../product/ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const response = await getAllProducts();
      // Display only 4 products
      setProducts(response.data.slice(0, 4));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="container py-4 my-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>Fresh recommendations</h3>
        <Link to="/products" className="text-primary text-decoration-none fw-bold" style={{ fontSize: '14px' }}>
          View more
        </Link>
      </div>

      <div className="row g-3">
        {products.map(product => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={product.pid}>
            <ProductCard product={product} showActions={false} />
          </div>
        ))}
      </div>
    </div>
  );
}