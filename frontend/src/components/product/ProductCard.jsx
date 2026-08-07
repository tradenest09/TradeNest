import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";

const rupee = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

export default function ProductCard({ product, showActions = false, onDelete }) {
  return (
    <div className="card-custom h-100 position-relative animate-fade-in d-flex flex-column text-decoration-none">
      
      {/* Wishlist Button */}
      <button className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center p-2" style={{ zIndex: 10, width: '36px', height: '36px', border: 'none' }}>
        <FiHeart size={18} className="text-muted" />
      </button>

      <Link to={`/products/${product.pid}`} className="text-decoration-none text-main d-flex flex-column h-100">
        {/* Image Area */}
        <div className="bg-light position-relative overflow-hidden" style={{ height: "180px", borderBottom: '1px solid var(--border-color)' }}>
          {product.images && product.images.length > 0 ? (
            <img 
              src={getImageUrl(product.images[0].imageUrl)} 
              alt={product.pname} 
              className="w-100 h-100" 
              style={{ objectFit: 'cover' }} 
              onError={handleImageError}
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f0f2f5' }}>
              <span style={{ fontSize: '48px' }}>📸</span>
            </div>
          )}

          {/* Badges */}
          <div className="position-absolute bottom-0 start-0 m-2 d-flex flex-column gap-1">
            <div>
              <span className={`badge ${product.type === 'SELL' ? 'bg-primary' : 'bg-warning text-dark'} shadow-sm`} style={{ fontSize: '10px', fontWeight: 600 }}>
                {product.type === 'SELL' ? 'FOR SALE' : 'FOR RENT'}
              </span>
            </div>
            <div>
              {product.status === 'AVAILABLE' && (
                <span className="badge bg-success shadow-sm" style={{ fontSize: '10px', fontWeight: 600 }}>AVAILABLE</span>
              )}
              {product.status === 'SOLD' && (
                <span className="badge bg-danger shadow-sm" style={{ fontSize: '10px', fontWeight: 600 }}>SOLD</span>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-3 d-flex flex-column flex-grow-1">
          <h3 className="fw-bold mb-1" style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
            {rupee(product.price)}
            {product.type === 'RENT' && <span className="text-muted fw-normal" style={{ fontSize: '14px' }}> / day</span>}
          </h3>
          
          <h6 className="text-main fw-normal mb-1 text-truncate" style={{ fontSize: '15px' }} title={product.pname}>
            {product.pname}
          </h6>
          
          <div className="mt-auto pt-3 d-flex justify-content-between align-items-center text-muted" style={{ fontSize: '12px' }}>
            <span className="text-truncate" style={{ maxWidth: '60%' }}>{product.categoryName}</span>
            <span>{new Date(product.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </Link>

      {/* Admin/Owner Actions */}
      {showActions && (
        <div className="card-footer bg-white border-top p-3 d-flex gap-2">
          <Link to={`/products/edit/${product.pid}`} className="btn btn-outline-primary btn-sm flex-grow-1" style={{ borderRadius: 'var(--radius-md)' }}>Edit</Link>
          <button className="btn btn-outline-danger btn-sm flex-grow-1" style={{ borderRadius: 'var(--radius-md)' }} onClick={() => onDelete(product.pid)}>Delete</button>
        </div>
      )}
    </div>
  );
}