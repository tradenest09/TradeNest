import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeaturedProducts from "./FeaturedProducts";
import { getAllCategories } from "../../api/categoryApi";

const getCategoryIcon = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("car") || lowerName.includes("vehicle")) return "🚗";
  if (lowerName.includes("mobile") || lowerName.includes("phone")) return "📱";
  if (lowerName.includes("bike") || lowerName.includes("motorcycle")) return "🏍️";
  if (lowerName.includes("electronic") || lowerName.includes("computer") || lowerName.includes("laptop") || lowerName.includes("tv")) return "💻";
  if (lowerName.includes("furniture") || lowerName.includes("bed") || lowerName.includes("wardrobe")) return "🛋️";
  if (lowerName.includes("property") || lowerName.includes("house") || lowerName.includes("apartment") || lowerName.includes("rent")) return "🏠";
  if (lowerName.includes("book") || lowerName.includes("education")) return "📚";
  if (lowerName.includes("sport") || lowerName.includes("fitness")) return "⚽";
  if (lowerName.includes("fashion") || lowerName.includes("cloth")) return "👕";
  return "📦"; // Default icon
};

export default function HomeComp() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Failed to load categories", error);
    }
  };

  return (
    <div className="bg-color min-vh-100">
      
      {/* Clean Light Hero Banner */}
      <div className="container mt-3 mb-4">
        <div className="card-custom border-0 bg-white shadow-sm overflow-hidden d-flex flex-column flex-md-row align-items-center">
          <div className="p-5 p-md-5 w-100 w-md-50">
            <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>
              Buy, sell, and rent <br/>
              <span className="text-primary">anything, easily.</span>
            </h1>
            <p className="text-muted mb-4 fs-5" style={{ maxWidth: '400px' }}>
              The most trusted marketplace to discover electronics, vehicles, furniture, and more.
            </p>
            <div className="d-flex gap-3">
              <Link to="/products" className="btn btn-primary fw-bold px-4 py-2" style={{ borderRadius: 'var(--radius-md)' }}>
                Start Browsing
              </Link>
            </div>
          </div>
          <div className="w-100 w-md-50 bg-light d-none d-md-flex align-items-center justify-content-center" style={{ minHeight: '220px' }}>
             {/* Abstract Premium Illustration representation */}
             <div className="position-relative" style={{ width: '300px', height: '200px' }}>
                <div className="position-absolute rounded shadow-lg bg-white" style={{ width: '150px', height: '180px', top: '10px', left: '20px', zIndex: 2, border: '1px solid var(--border-color)' }}></div>
                <div className="position-absolute rounded shadow-md bg-primary opacity-75" style={{ width: '120px', height: '150px', top: '30px', right: '40px', zIndex: 1 }}></div>
             </div>
          </div>
        </div>
      </div>

      {/* Featured Categories Slider */}
      <div className="container mb-4">
        <h4 className="fw-bold mb-3" style={{ fontSize: '1.25rem' }}>Browse Categories</h4>
        <div className="d-flex overflow-auto no-scrollbar gap-3 pb-2" style={{ scrollBehavior: 'smooth' }}>
          {categories.map((cat) => (
            <div key={cat.cid} style={{ minWidth: '100px' }}>
              <Link to={`/products?category=${encodeURIComponent(cat.cname)}`} className="text-decoration-none">
                <div className="d-flex flex-column align-items-center text-center p-2 rounded hover-bg-light transition-all h-100">
                  <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center mb-2 hover-shadow-md" style={{ width: '64px', height: '64px', border: '1px solid var(--border-color)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <span style={{ fontSize: '24px' }}>{getCategoryIcon(cat.cname)}</span>
                  </div>
                  <span className="text-main fw-medium text-wrap" style={{ fontSize: '13px', lineHeight: '1.2' }}>{cat.cname}</span>
                </div>
              </Link>
            </div>
          ))}
          
          {categories.length === 0 && (
            <div className="w-100 text-center text-muted py-3">
              Loading categories...
            </div>
          )}
        </div>
      </div>

      {/* Fresh Recommendations (Featured Products) */}
      <FeaturedProducts />

      {/* Info / Trust Section */}
      <div className="container my-4">
        <div className="card-custom border-0 bg-white p-4 p-md-5 text-center shadow-sm">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="mb-3"><span style={{ fontSize: '40px' }}>🔒</span></div>
              <h5 className="fw-bold">100% Secure</h5>
              <p className="text-muted small mb-0">Verified users and secure JWT authentication for safe transactions.</p>
            </div>
            <div className="col-md-4">
              <div className="mb-3"><span style={{ fontSize: '40px' }}>🤝</span></div>
              <h5 className="fw-bold">Trusted Community</h5>
              <p className="text-muted small mb-0">Buy and sell directly with real people in your neighborhood.</p>
            </div>
            <div className="col-md-4">
              <div className="mb-3"><span style={{ fontSize: '40px' }}>⚡</span></div>
              <h5 className="fw-bold">Fast & Easy</h5>
              <p className="text-muted small mb-0">Post an ad in minutes or find what you need instantly.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}