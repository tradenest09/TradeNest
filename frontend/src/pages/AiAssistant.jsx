import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAiRecommendations } from "../api/aiApi";
import { getImageUrl } from "../utils/imageUtils";
import { FiCpu, FiSearch, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AiAssistant() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.warning("Please describe what you are looking for");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await getAiRecommendations(query);
      if (response && response.recommendations) {
        setRecommendations(response.recommendations);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to get AI recommendations");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
  };

  return (
    <div className="container py-5 mt-4">
      <div className="text-center mb-5 fade-in">
        <div className="d-inline-block bg-primary bg-opacity-10 text-primary p-3 rounded-circle mb-3">
          <FiCpu size={40} />
        </div>
        <h1 className="fw-bold display-5 mb-3">AI Shopping Assistant</h1>
        <p className="text-muted fs-5 max-w-700 mx-auto">
          Describe what you're looking for, your budget, or your needs, and our AI will find the best matching products from TradeNest.
        </p>
      </div>

      <div className="row justify-content-center mb-5 fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 bg-white custom-rounded p-4">
            <form onSubmit={handleSearch}>
              <div className="mb-4">
                <textarea
                  className="form-control form-control-lg bg-light border-0"
                  rows="3"
                  placeholder="E.g., I need a gaming laptop under ₹60,000 for college..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ resize: "none" }}
                ></textarea>
              </div>
              
              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="text-muted small align-self-center me-2">Examples:</span>
                <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => handleExampleClick("I need a bike under ₹80,000")}>
                  I need a bike under ₹80,000
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => handleExampleClick("I need a laptop for coding")}>
                  I need a laptop for coding
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => handleExampleClick("I need furniture for my room")}>
                  I need furniture for my room
                </button>
              </div>

              <div className="text-center">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg px-5 custom-rounded shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Thinking...</>
                  ) : (
                    <><FiSearch className="me-2" /> Ask AI</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {searched && (
        <div className="mt-5 fade-in">
          <h3 className="fw-bold mb-4 border-bottom pb-2">
            AI Recommendations <span className="badge bg-primary rounded-pill fs-6 ms-2">{recommendations.length}</span>
          </h3>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Analyzing products to find the best match...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="row g-4">
              {recommendations.map((item, index) => {
                const product = item.productDetails;
                if (!product) return null;
                
                const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
                const imageSrc = primaryImage ? getImageUrl(primaryImage.imageUrl) : "https://via.placeholder.com/300x200?text=No+Image";
                
                return (
                  <div key={item.productId} className="col-12 col-md-6 col-lg-4" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="card h-100 border-0 shadow-sm product-card overflow-hidden">
                      {/* AI Score Badge */}
                      <div className="position-absolute top-0 end-0 m-3 z-1">
                        <span className={`badge ${item.score >= 90 ? 'bg-success' : item.score >= 75 ? 'bg-primary' : 'bg-secondary'} rounded-pill px-3 py-2 shadow-sm`}>
                          <FiCheckCircle className="me-1" /> {item.score}% Match
                        </span>
                      </div>
                      
                      <div className="position-relative" style={{ height: "200px", backgroundColor: "#f8f9fa" }}>
                        <img 
                          src={imageSrc} 
                          className="w-100 h-100 object-fit-cover" 
                          alt={product.pname} 
                        />
                      </div>
                      
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge bg-light text-dark border">{product.categoryName}</span>
                          <span className="badge bg-light text-dark border">{product.type}</span>
                        </div>
                        
                        <h5 className="card-title fw-bold mb-1 text-truncate" title={product.pname}>
                          {product.pname}
                        </h5>
                        
                        <h4 className="text-primary fw-bold mb-3">₹{product.price}</h4>
                        
                        <div className="bg-light p-3 rounded mb-4 flex-grow-1">
                          <p className="mb-0 small text-dark fw-medium">
                            <FiCpu className="me-2 text-primary" />
                            <strong>AI Reason:</strong> {item.reason}
                          </p>
                        </div>
                        
                        <button 
                          className="btn btn-outline-primary w-100 mt-auto custom-rounded"
                          onClick={() => navigate(`/products/${product.pid}`)}
                        >
                          View Product Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded shadow-sm">
              <p className="text-muted fs-5 mb-0">No matching products found. Try adjusting your query or budget.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
