import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProductById, getRentByProduct } from "../../api/productApi";
import { createPurchase, createRental, addPayment, updatePaymentStatus } from "../../api/orderApi";
import { FiMapPin, FiHeart, FiShare2, FiShield, FiAlertCircle, FiCheckCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";
import { toast } from "react-toastify";

const rupee = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

export default function ProductDetails() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rentDays, setRentDays] = useState(1);

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [transactionType, setTransactionType] = useState('BUY');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => { loadProduct(); }, [pid]);

  const loadProduct = async () => {
    try {
      const res = await getProductById(pid);
      const fetchedProduct = res.data;
      
      // If product is for rent, fetch its rent details
      if (fetchedProduct.type === 'RENT' || fetchedProduct.type === 'BOTH') {
        try {
          const rentRes = await getRentByProduct(fetchedProduct.pid);
          // Only pull securityDeposit from rentRes. chargePerDay is already in fetchedProduct.price
          fetchedProduct.rentDetails = { securityDeposit: rentRes.data.securityDeposit };
        } catch (error) {
          console.error("Rent details not found for this product.");
          fetchedProduct.rentDetails = { securityDeposit: 0 };
        }
      }
      
      setProduct(fetchedProduct);
    } catch {
      toast.error("Asset not found");
    } finally {
      setLoading(false);
    }
  };

  const openPurchaseModal = () => {
    if (!user) return toast.warning("Please login to buy items.");
    setTransactionType('BUY');
    setShowConfirmModal(true);
  };

  const openRentalModal = () => {
    if (!user) return toast.warning("Please login to rent items.");
    if (rentDays < 1) return toast.warning("Minimum rental period is 1 day.");
    setTransactionType('RENT');
    setShowConfirmModal(true);
  };

  const submitTransaction = async () => {
    if (transactionType === 'BUY') {
      await handlePurchase();
    } else {
      await handleRent();
    }
  };

  const handlePurchase = async () => {
    setProcessing(true);
    try {
      const res = await createPurchase({ pid: product.pid, buyerId: user.uid, quantity: 1 });
      const purchaseId = res.data.purchaseId || res.data.id;
      
      const paymentRes = await addPayment({
        purchaseId: purchaseId,
        payerId: user.uid,
        amount: product.price,
        paymentMethod: "TradeNest Secure",
        transactionRef: "TXN-" + Date.now()
      });
      
      await updatePaymentStatus(paymentRes.data.paymentId, { status: "SUCCESS" });

      setOrderId(purchaseId || "TRN-" + Math.floor(Math.random() * 1000000));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      loadProduct();
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message || "Failed to complete purchase.";
      toast.error(backendMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleRent = async () => {
    setProcessing(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + parseInt(rentDays));
      
      const res = await createRental({ 
        pid: product.pid, 
        renterId: user.uid, 
        startDate: startDate.toISOString().split('T')[0], 
        endDate: endDate.toISOString().split('T')[0] 
      });
      
      const rentalId = res.data.rentalId || res.data.id;

      const paymentRes = await addPayment({
        rentalId: rentalId,
        payerId: user.uid,
        amount: rentalTotalAmount,
        paymentMethod: "TradeNest Secure",
        transactionRef: "TXN-" + Date.now()
      });
      
      await updatePaymentStatus(paymentRes.data.paymentId, { status: "SUCCESS" });
      
      setOrderId(rentalId || "RNT-" + Math.floor(Math.random() * 1000000));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      loadProduct();
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message || "Failed to secure rental.";
      toast.error(backendMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-color">
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
    </div>
  );

  if (!product) return <div className="container py-5 text-center"><h4>Asset not found</h4></div>;

  const isOwner = user && user.uid === product.uid;
  const isRent = product.type === 'RENT';
  const rentalTotalAmount = isRent 
    ? (product.price * rentDays) + (product.rentDetails?.securityDeposit || 0)
    : 0;

  return (
    <>
      <div className="bg-color min-vh-100 py-4">
        <div className="container">
          
          {/* Breadcrumb */}
          <div className="mb-4 text-muted small">
            <Link to="/" className="text-decoration-none text-muted hover-primary">Home</Link> <span className="mx-2">/</span>
            <Link to="/products" className="text-decoration-none text-muted hover-primary">Marketplace</Link> <span className="mx-2">/</span>
            <Link to={`/products?category=${encodeURIComponent(product.categoryName)}`} className="text-decoration-none text-muted hover-primary">{product.categoryName}</Link> <span className="mx-2">/</span>
            <span className="text-main fw-bold">{product.pname}</span>
          </div>

          <div className="row g-4">
            
            {/* Left Column */}
            <div className="col-lg-8">
              <div className="card-custom bg-white border-0 shadow-sm mb-4">
                <div className="position-relative overflow-hidden" style={{ height: "450px", backgroundColor: "#f8f9fa", borderRadius: "12px 12px 0 0" }}>
                  {product.images && product.images.length > 0 ? (
                    <>
                      <img 
                        src={getImageUrl(product.images[currentImageIndex].imageUrl)} 
                        alt={product.pname} 
                        className="w-100 h-100 object-fit-contain transition-all" 
                        style={{ objectFit: 'contain' }}
                        onError={handleImageError}
                      />
                      
                      {product.images.length > 1 && (
                        <>
                          <button 
                            className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center p-2 hover-primary"
                            onClick={() => setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                          >
                            <FiChevronLeft size={24} />
                          </button>
                          <button 
                            className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center p-2 hover-primary"
                            onClick={() => setCurrentImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                          >
                            <FiChevronRight size={24} />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                      <span style={{ fontSize: '80px' }}>📸</span>
                    </div>
                  )}
                </div>
                
                {/* Thumbnails Gallery */}
                {product.images && product.images.length > 1 && (
                  <div className="d-flex gap-2 p-3 bg-white border-bottom overflow-auto" style={{ scrollbarWidth: 'none' }}>
                    {product.images.map((img, idx) => (
                      <div 
                        key={idx}
                        className={`rounded overflow-hidden cursor-pointer flex-shrink-0 transition-all ${idx === currentImageIndex ? 'border border-2 border-primary shadow-sm' : 'border border-2 border-transparent opacity-75 hover-opacity-100'}`}
                        style={{ width: '80px', height: '80px' }}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <img 
                          src={getImageUrl(img.imageUrl)} 
                          alt={`Thumbnail ${idx + 1}`} 
                          className="w-100 h-100" 
                          style={{ objectFit: 'cover' }}
                          onError={handleImageError}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4">
                  <h4 className="fw-bold mb-4">Description</h4>
                  <p className="text-main" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                    {product.pdesc}
                  </p>
                  <hr className="my-4" />
                  <h4 className="fw-bold mb-4">Details</h4>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <span className="text-muted d-block small text-uppercase fw-bold mb-1">Category</span>
                      <span className="text-main">{product.categoryName}</span>
                    </div>
                    <div className="col-md-6 mb-3">
                      <span className="text-muted d-block small text-uppercase fw-bold mb-1">Posted On</span>
                      <span className="text-main">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-lg-4">
              
              {/* Price & Action Card */}
              <div className="card-custom bg-white border-0 shadow-sm p-4 mb-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h1 className="fw-bold text-main mb-0 display-6">
                      {rupee(product.price)} {isRent && <span className="fs-5 text-muted fw-normal">/ day</span>}
                    </h1>
                    {isRent && (
                      <div className="mt-2 mb-1">
                        <span className="text-muted small fw-bold text-uppercase d-block">Security Deposit</span>
                        <span className="fw-medium text-success">{rupee(product.rentDetails?.securityDeposit)} <small>(Refundable)</small></span>
                      </div>
                    )}
                  </div>
                  <div className="d-flex gap-3">
                    <button className="btn btn-light rounded-circle p-2 border-0 shadow-sm"><FiShare2 size={20} /></button>
                    <button className="btn btn-light rounded-circle p-2 border-0 shadow-sm"><FiHeart size={20} /></button>
                  </div>
                </div>
                
                <h5 className="text-main fw-normal mb-3" style={{ lineHeight: '1.4' }}>{product.pname}</h5>
                <div className="d-flex align-items-center text-muted small mb-4">
                  <FiMapPin className="me-1" /> India
                  <span className="mx-2">•</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>

                {product.status === 'SOLD' ? (
                  <button 
                    className="btn btn-secondary w-100 py-3 fw-bold fs-5 shadow-sm" 
                    disabled
                  >
                    Already Sold
                  </button>
                ) : product.status === 'AVAILABLE' ? (
                  !isRent ? (
                    <button 
                      className="btn btn-primary w-100 py-3 fw-bold fs-5 shadow-sm" 
                      onClick={openPurchaseModal} 
                      disabled={isOwner}
                    >
                      {isOwner ? "You own this item" : "Buy Now"}
                    </button>
                  ) : (
                    <div className="bg-light p-3 rounded mb-3 border">
                      <label className="form-label text-muted small fw-bold text-uppercase">Rental Duration (Days)</label>
                      <div className="input-group mb-3">
                        <input type="number" className="form-control" value={rentDays} onChange={e => setRentDays(e.target.value)} min="1" disabled={isOwner} />
                      </div>
                      <div className="d-flex justify-content-between mb-3 fw-bold border-top pt-2">
                        <span>Total Payable:</span>
                        <span className="text-primary">{rupee(rentalTotalAmount)}</span>
                      </div>
                      <button 
                        className="btn btn-primary w-100 py-3 fw-bold fs-5 shadow-sm" 
                        onClick={openRentalModal} 
                        disabled={rentDays < 1 || isOwner}
                      >
                        {isOwner ? "You own this item" : "Rent Now"}
                      </button>
                    </div>
                  )
                ) : (
                  <div className="alert alert-secondary text-center fw-bold text-uppercase p-3 mb-0">
                    <FiCheckCircle className="me-2" /> Currently {product.status}
                  </div>
                )}
              </div>

              {/* Seller Card */}
              <div className="card-custom bg-white border-0 shadow-sm p-4 mb-4">
                <h5 className="fw-bold mb-3">Owner Description</h5>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: '60px', height: '60px' }}>
                    {product.uid?.toString().charAt(0) || "U"}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">User ID: {product.uid}</h6>
                    <span className="text-muted small">Verified User</span>
                  </div>
                </div>
                <button className="btn btn-outline-primary w-100 py-2 fw-bold bg-white">Chat with Owner</button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-bottom-0 bg-light rounded-top" style={{ padding: '1.5rem' }}>
                <h5 className="modal-title fw-bold">Confirm {transactionType === 'BUY' ? 'Purchase' : 'Rental'}</h5>
                <button type="button" className="btn-close" onClick={() => !processing && setShowConfirmModal(false)} disabled={processing}></button>
              </div>
              <div className="modal-body p-4">
                
                {/* Product Summary */}
                <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded">
                  <div className="bg-white rounded d-flex align-items-center justify-content-center shadow-sm" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                    📸
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-main">{product.pname}</h6>
                    <span className="badge bg-secondary">{product.categoryName}</span>
                  </div>
                </div>

                {/* Details Table */}
                <div className="mb-4 text-main">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Owner ID</span>
                    <span className="fw-medium">{product.uid}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Your Name</span>
                    <span className="fw-medium">{user?.fname} {user?.lname}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Payment Method</span>
                    <span className="fw-medium"><FiShield className="text-success me-1"/> TradeNest Secure</span>
                  </div>
                  
                  {transactionType === 'BUY' ? (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Quantity</span>
                      <span className="fw-medium">1</span>
                    </div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Rent Per Day</span>
                        <span className="fw-medium">{rupee(product.price)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Rental Duration</span>
                        <span className="fw-medium">{rentDays} Days</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Rental Charges <small>(Rent Per Day × Days)</small></span>
                        <span className="fw-medium">{rupee(product.price * rentDays)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Security Deposit <small>(Refundable)</small></span>
                        <span className="fw-medium">{rupee(product.rentDetails?.securityDeposit)}</span>
                      </div>
                    </>
                  )}
                </div>

                <hr className="my-3"/>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-5">Total Payable Today</span>
                  <span className="fw-bold fs-4 text-primary">
                    {transactionType === 'BUY' ? rupee(product.price) : rupee(rentalTotalAmount)}
                  </span>
                </div>

              </div>
              <div className="modal-footer border-top-0 p-4 pt-0">
                <button type="button" className="btn btn-light fw-bold px-4" onClick={() => setShowConfirmModal(false)} disabled={processing}>Cancel</button>
                <button type="button" className="btn btn-primary fw-bold px-4 flex-grow-1" onClick={submitTransaction} disabled={processing}>
                  {processing ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...</>
                  ) : (
                    `Confirm ${transactionType === 'BUY' ? 'Purchase' : 'Rental'}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg text-center" style={{ borderRadius: '16px' }}>
              <div className="modal-body p-5">
                <div className="mb-4">
                  <div className="rounded-circle bg-success bg-opacity-10 text-success d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <FiCheckCircle size={40} />
                  </div>
                </div>
                <h3 className="fw-bold text-main mb-3">{transactionType === 'BUY' ? 'Purchase' : 'Rental'} Successful!</h3>
                <p className="text-muted mb-4">Your request has been processed securely.</p>
                
                <div className="bg-light rounded p-3 text-start mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Order ID</span>
                    <span className="fw-bold small">{orderId}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Product</span>
                    <span className="fw-bold small text-truncate ms-3" style={{ maxWidth: '150px' }}>{product.pname}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Amount Paid</span>
                    <span className="fw-bold small text-success">
                      {transactionType === 'BUY' ? rupee(product.price) : rupee(rentalTotalAmount)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Date</span>
                    <span className="fw-bold small">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4">
                  <button className="btn btn-light fw-bold flex-grow-1" onClick={() => navigate('/products')}>Continue Shopping</button>
                  <button className="btn btn-primary fw-bold flex-grow-1" onClick={() => navigate('/dashboard?tab=purchases')}>Go To Orders</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}