import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPurchasesByBuyer as getUserOrders, getRentalsByRenter as getUserRentals } from "../../api/orderApi";
import { getProductsBySeller as getProductsByOwner, deleteProduct, getAllProducts, getProductById } from "../../api/productApi";
import { getAllUsers, getUserById, changePassword } from "../../api/userApi";
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import { FiUser, FiShoppingBag, FiList, FiLogOut, FiEdit, FiTrash2, FiBox, FiClock, FiShield, FiHeart, FiLock, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import ProductCard from "../product/ProductCard";

export function UserAccountPage() {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";
  
  const { user } = useSelector((state) => state.auth);
  const [myProducts, setMyProducts] = useState([]);
  
  // Orders State
  const [enrichedPurchases, setEnrichedPurchases] = useState([]);
  const [enrichedRentals, setEnrichedRentals] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Controls State
  const [filterType, setFilterType] = useState('ALL'); // ALL, BUY, RENT
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Security State
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Logout State
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      toast.success("Password updated successfully.");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    navigate('/logout');
  };
  
  useEffect(() => { if (user) loadData(); }, [user, currentTab]);

  const loadData = async () => {
    if (currentTab === "products") {
      const res = await getProductsByOwner(user.uid);
      setMyProducts(Array.isArray(res.data) ? res.data : []);
    } else if (currentTab === "purchases") {
      setLoadingOrders(true);
      const [orderRes, rentRes] = await Promise.all([getUserOrders(user.uid), getUserRentals(user.uid)]);
      const orders = Array.isArray(orderRes.data) ? orderRes.data : [];
      const rentals = Array.isArray(rentRes.data) ? rentRes.data : [];

      const ePurchases = await Promise.all(orders.map(async (o) => {
        try {
          const p = await getProductById(o.pid);
          const s = await getUserById(o.sellerId);
          return { ...o, product: p.data, seller: s.data };
        } catch { return { ...o, product: {}, seller: {} }; }
      }));

      const eRentals = await Promise.all(rentals.map(async (r) => {
        try {
          const p = await getProductById(r.pid);
          const o = await getUserById(r.ownerId);
          return { ...r, product: p.data, owner: o.data };
        } catch { return { ...r, product: {}, owner: {} }; }
      }));

      setEnrichedPurchases(ePurchases);
      setEnrichedRentals(eRentals);
      setLoadingOrders(false);
    }
  };

  const handleDelete = async (pid) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await deleteProduct(pid);
      toast.success("Listing deleted");
      loadData();
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  const rupee = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  const filterAndSort = (list, type) => {
    let filtered = list.filter(item => {
      const name = item.product?.pname?.toLowerCase() || "";
      const id = (type === 'BUY' ? item.purchaseId : item.rentalId)?.toString() || "";
      return name.includes(searchQuery.toLowerCase()) || id.includes(searchQuery);
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(type === 'BUY' ? a.purchaseDate : a.startDate).getTime();
      const dateB = new Date(type === 'BUY' ? b.purchaseDate : b.startDate).getTime();
      const priceA = type === 'BUY' ? a.amount : a.totalAmount;
      const priceB = type === 'BUY' ? b.amount : b.totalAmount;

      if (sortBy === 'NEWEST') return dateB - dateA;
      if (sortBy === 'OLDEST') return dateA - dateB;
      if (sortBy === 'HIGH_PRICE') return priceB - priceA;
      if (sortBy === 'LOW_PRICE') return priceA - priceB;
      return 0;
    });
  };

  const processedPurchases = filterAndSort(enrichedPurchases, 'BUY');
  const processedRentals = filterAndSort(enrichedRentals, 'RENT');

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar d-none d-md-flex pb-4">
        <div className="p-4 border-bottom text-center">
          <div className="d-flex flex-column align-items-center">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-1 mb-3 shadow-sm" style={{ width: '90px', height: '90px' }}>
              {user?.fname?.charAt(0) || "U"}
            </div>
            <h5 className="fw-bold mb-1 text-main d-flex align-items-center justify-content-center gap-1">
              {user?.fname} {user?.lname} 
              <FiCheckCircle className="text-primary" size={16} title="Verified Account" />
            </h5>
            <span className="text-muted small fw-medium">@{user?.uname || 'username'}</span>
          </div>
        </div>
        
        <div className="flex-grow-1 py-3">
          <Link to="/dashboard?tab=profile" className={`sidebar-link ${currentTab === "profile" ? "active" : ""}`}>
            <FiUser size={18} /> Edit Profile
          </Link>
          <Link to="/dashboard?tab=products" className={`sidebar-link ${currentTab === "products" ? "active" : ""}`}>
            <FiList size={18} /> My Listings
          </Link>
          <Link to="/dashboard?tab=purchases" className={`sidebar-link ${currentTab === "purchases" ? "active" : ""}`}>
            <FiShoppingBag size={18} /> My Orders
          </Link>
          <Link to="/dashboard?tab=wishlist" className={`sidebar-link ${currentTab === "wishlist" ? "active" : ""}`}>
            <FiHeart size={18} /> Wishlist
          </Link>
          <Link to="/dashboard?tab=security" className={`sidebar-link ${currentTab === "security" ? "active" : ""}`}>
            <FiShield size={18} /> Security
          </Link>
        </div>
        
        <div className="mt-auto border-top p-3">
          <button onClick={() => setShowLogoutModal(true)} className="sidebar-link text-danger w-100 bg-transparent border-0 text-start" style={{ borderLeft: 'none' }}>
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="card-custom bg-white p-4 text-center max-w-sm mx-3 border-0 shadow-lg">
            <div className="mb-3 d-flex justify-content-center">
              <div className="bg-danger-subtle text-danger rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                <FiLogOut size={28} />
              </div>
            </div>
            <h4 className="fw-bold mb-2">Log out</h4>
            <p className="text-muted mb-4">Are you sure you want to log out of your account?</p>
            <div className="d-flex gap-2">
              <button className="btn btn-light flex-grow-1 fw-bold" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="btn btn-danger flex-grow-1 fw-bold" onClick={handleLogoutConfirm}>Log Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="container-fluid">
          {/* Welcome Banner */}
          <div className="bg-primary text-white p-4 rounded shadow-sm mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h3 className="fw-bold mb-1">Welcome back, {user?.fname} 👋</h3>
              <p className="mb-0 opacity-75">Manage your profile, listings and orders from one place.</p>
            </div>
          </div>
          {currentTab === "profile" && (
            <div className="row g-4 max-w-4xl" style={{ maxWidth: '1000px' }}>
              {/* Personal Information */}
              <div className="col-12 col-lg-8">
                <div className="card-custom bg-white p-4 p-md-5 border-0 shadow-sm h-100">
                  <h5 className="fw-bold mb-4 border-bottom pb-3">Personal Information</h5>
                  <form>
                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold text-uppercase">First Name</label>
                        <input type="text" className="form-control bg-light" defaultValue={user?.fname} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold text-uppercase">Last Name</label>
                        <input type="text" className="form-control bg-light" defaultValue={user?.lname} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-muted small fw-bold text-uppercase">Username</label>
                      <input type="text" className="form-control bg-light" defaultValue={user?.uname} />
                    </div>
                    
                    <div className="row g-4 mb-5">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold text-uppercase d-flex align-items-center gap-1">
                          Email <FiLock size={14} className="text-secondary" />
                        </label>
                        <input type="email" className="form-control text-muted" defaultValue={user?.email} readOnly disabled />
                        <div className="form-text small"><FiLock size={10} /> Cannot be edited currently.</div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold text-uppercase d-flex align-items-center gap-1">
                          Phone Number <FiLock size={14} className="text-secondary" />
                        </label>
                        <input type="text" className="form-control text-muted" defaultValue={user?.contactNumber || user?.phone || ""} readOnly disabled />
                        <div className="form-text small"><FiLock size={10} /> Cannot be edited currently.</div>
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary px-5 py-2 fw-bold shadow-sm">Save Changes</button>
                  </form>
                </div>
              </div>

              {/* Account Information */}
              <div className="col-12 col-lg-4">
                <div className="card-custom bg-white p-4 p-md-5 border-0 shadow-sm h-100">
                  <h5 className="fw-bold mb-4 border-bottom pb-3">Account Status</h5>
                  <div className="d-flex flex-column gap-4">
                    <div>
                      <span className="d-block text-muted small fw-bold text-uppercase mb-1">Verification</span>
                      <span className="badge bg-success-subtle text-success border border-success d-inline-flex align-items-center gap-1 px-3 py-2">
                        <FiCheckCircle /> Verified User
                      </span>
                    </div>
                    <div>
                      <span className="d-block text-muted small fw-bold text-uppercase mb-1">User Role</span>
                      <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-2">
                        {user?.role || 'USER'}
                      </span>
                    </div>
                    <div>
                      <span className="d-block text-muted small fw-bold text-uppercase mb-1">Member Since</span>
                      <span className="fw-medium text-main">Not Available</span>
                    </div>
                    <div>
                      <span className="d-block text-muted small fw-bold text-uppercase mb-1">Last Login</span>
                      <span className="fw-medium text-main">Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === "products" && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">My Active Ads</h4>
                <Link to="/products/add" className="btn btn-primary btn-sm px-4 fw-bold">Post an Ad</Link>
              </div>
              <div className="row g-3">
                {myProducts.length === 0 ? (
                  <div className="col-12">
                    <div className="card-custom bg-white p-5 text-center border-0 shadow-sm">
                      <FiBox size={48} className="text-muted mb-3" />
                      <h5>You haven't listed anything yet</h5>
                      <p className="text-muted mb-4">Start selling and renting items easily.</p>
                      <Link to="/products/add" className="btn btn-outline-primary px-4 fw-bold">Post First Ad</Link>
                    </div>
                  </div>
                ) : (
                  myProducts.map(p => (
                    <div className="col-md-4 col-lg-3" key={p.pid}>
                      <ProductCard product={p} showActions={true} onDelete={handleDelete} />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {currentTab === "purchases" && (
            <div className="orders-container max-w-4xl" style={{ maxWidth: '1000px' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h4 className="fw-bold mb-0">My Orders</h4>
                
                {/* Search & Sort Controls */}
                <div className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search by name or order ID..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '250px' }}
                  />
                  <select 
                    className="form-select" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: '150px' }}
                  >
                    <option value="NEWEST">Newest First</option>
                    <option value="OLDEST">Oldest First</option>
                    <option value="HIGH_PRICE">Highest Price</option>
                    <option value="LOW_PRICE">Lowest Price</option>
                  </select>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="nav nav-pills mb-4 gap-2">
                <button className={`nav-link px-4 fw-bold ${filterType === 'ALL' ? 'active shadow-sm' : 'bg-white text-muted border'}`} onClick={() => setFilterType('ALL')}>All Orders</button>
                <button className={`nav-link px-4 fw-bold ${filterType === 'BUY' ? 'active shadow-sm' : 'bg-white text-muted border'}`} onClick={() => setFilterType('BUY')}>Purchases</button>
                <button className={`nav-link px-4 fw-bold ${filterType === 'RENT' ? 'active shadow-sm' : 'bg-white text-muted border'}`} onClick={() => setFilterType('RENT')}>Rentals</button>
              </div>

              {loadingOrders ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-5">
                  
                  {/* Purchases Section */}
                  {(filterType === 'ALL' || filterType === 'BUY') && (
                    <div>
                      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                        <FiShoppingBag className="text-primary" /> Purchases ({processedPurchases.length})
                      </h5>
                      {processedPurchases.length === 0 ? (
                        <div className="alert alert-light border text-center py-4 text-muted rounded">No purchases found.</div>
                      ) : (
                        <div className="d-flex flex-column gap-3">
                          {processedPurchases.map(order => (
                            <div key={order.purchaseId} className="card-custom bg-white border-0 shadow-sm p-3 p-md-4">
                              <div className="row g-4 align-items-center">
                                <div className="col-12 col-md-2 text-center">
                                  <div className="bg-light rounded d-flex align-items-center justify-content-center w-100 overflow-hidden" style={{ height: '100px' }}>
                                    {order.product?.images && order.product.images.length > 0 ? (
                                      <img src={getImageUrl(order.product.images[0].imageUrl)} alt={order.product?.pname} className="w-100 h-100" style={{ objectFit: 'cover' }} onError={handleImageError} />
                                    ) : (
                                      <span style={{ fontSize: '32px' }}>📸</span>
                                    )}
                                  </div>
                                </div>
                                <div className="col-12 col-md-6">
                                  <span className="badge bg-secondary mb-2">{order.product?.categoryName || 'Unknown Category'}</span>
                                  <h5 className="fw-bold text-main mb-1">{order.product?.pname || 'Unknown Product'}</h5>
                                  <p className="text-muted small mb-2">Sold by: {order.seller?.fname} {order.seller?.lname}</p>
                                  <div className="d-flex gap-3 text-muted small">
                                    <span><strong>Order ID:</strong> #{order.purchaseId}</span>
                                    <span><strong>Date:</strong> {new Date(order.purchaseDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div className="col-12 col-md-4 text-md-end border-start-md ps-md-4 d-flex flex-column justify-content-center">
                                  <span className="text-muted small fw-bold text-uppercase">Price Paid</span>
                                  <h3 className="fw-bold text-success mb-2">{rupee(order.amount)}</h3>
                                  <div><span className="badge bg-success-subtle text-success border border-success mb-3">PURCHASE COMPLETED</span></div>
                                  <div className="d-flex gap-2 justify-content-md-end">
                                    <Link to={`/products/${order.pid}`} className="btn btn-primary btn-sm fw-bold w-100">View Product</Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rentals Section */}
                  {(filterType === 'ALL' || filterType === 'RENT') && (
                    <div>
                      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                        <FiClock className="text-primary" /> Active Rentals ({processedRentals.length})
                      </h5>
                      {processedRentals.length === 0 ? (
                        <div className="alert alert-light border text-center py-4 text-muted rounded">No rentals found.</div>
                      ) : (
                        <div className="d-flex flex-column gap-3">
                          {processedRentals.map(rental => {
                            // Calculate days
                            const start = new Date(rental.startDate);
                            const end = new Date(rental.endDate);
                            const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
                            const rentPerDay = rental.product?.price || (rental.totalAmount / durationDays); // Fallback logic
                            const rentalCharges = rentPerDay * durationDays;
                            const secDeposit = Math.max(0, rental.totalAmount - rentalCharges);
                            
                            return (
                              <div key={rental.rentalId} className="card-custom bg-white border-0 shadow-sm p-3 p-md-4">
                                <div className="row g-4 align-items-center">
                                  <div className="col-12 col-md-2 text-center">
                                    <div className="bg-light rounded d-flex align-items-center justify-content-center w-100 overflow-hidden" style={{ height: '100px' }}>
                                      {rental.product?.images && rental.product.images.length > 0 ? (
                                        <img src={getImageUrl(rental.product.images[0].imageUrl)} alt={rental.product?.pname} className="w-100 h-100" style={{ objectFit: 'cover' }} onError={handleImageError} />
                                      ) : (
                                        <span style={{ fontSize: '32px' }}>📸</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-6">
                                    <span className="badge bg-warning text-dark mb-2">{rental.product?.categoryName || 'Unknown Category'}</span>
                                    <h5 className="fw-bold text-main mb-1">{rental.product?.pname || 'Unknown Product'}</h5>
                                    <p className="text-muted small mb-3">Owner: {rental.owner?.fname} {rental.owner?.lname} (ID: {rental.ownerId})</p>
                                    
                                    <div className="bg-light p-3 rounded border text-muted small">
                                      <div className="row mb-2">
                                        <div className="col-6"><strong>Rental Duration:</strong> {durationDays} Days</div>
                                        <div className="col-6"><strong>Rent Per Day:</strong> {rupee(rentPerDay)}</div>
                                      </div>
                                      <div className="row mb-2">
                                        <div className="col-6"><strong>Start Date:</strong> {new Date(rental.startDate).toLocaleDateString()}</div>
                                        <div className="col-6"><strong>End Date:</strong> {new Date(rental.endDate).toLocaleDateString()}</div>
                                      </div>
                                      <hr className="my-2" />
                                      <div className="row">
                                        <div className="col-6"><strong>Rental Charges:</strong> {rupee(rentalCharges)}</div>
                                        <div className="col-6"><strong>Security Deposit:</strong> {rupee(secDeposit)}</div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="col-12 col-md-4 text-md-end border-start-md ps-md-4 d-flex flex-column justify-content-center">
                                    <span className="text-muted small fw-bold text-uppercase">Total Paid</span>
                                    <h3 className="fw-bold text-primary mb-2">{rupee(rental.totalAmount)}</h3>
                                    <div><span className="badge bg-primary-subtle text-primary border border-primary mb-3">ACTIVE RENTAL</span></div>
                                    <div className="d-flex gap-2 justify-content-md-end">
                                      <Link to={`/products/${rental.pid}`} className="btn btn-primary btn-sm w-100 fw-bold">View Product</Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {currentTab === "wishlist" && (
            <div className="max-w-4xl" style={{ maxWidth: '1000px' }}>
              <div className="card-custom bg-white p-5 text-center border-0 shadow-sm rounded">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <FiHeart size={40} className="text-secondary" />
                </div>
                <h4 className="fw-bold mb-2">Your Wishlist is Empty</h4>
                <p className="text-muted mb-0">Save items you love and they will appear here.</p>
                <Link to="/" className="btn btn-primary mt-4 px-4 fw-bold">Explore Marketplace</Link>
              </div>
            </div>
          )}

          {currentTab === "security" && (
            <div className="max-w-xl" style={{ maxWidth: '600px' }}>
              <div className="card-custom bg-white p-4 p-md-5 border-0 shadow-sm h-100">
                <h5 className="fw-bold mb-4 border-bottom pb-3 d-flex align-items-center gap-2">
                  <FiShield className="text-primary" /> Password Management
                </h5>
                <form>
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Current Password</label>
                    <div className="position-relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="form-control bg-light" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                      />
                      <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y border-0 text-muted" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">New Password</label>
                    <div className="position-relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="form-control bg-light" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                      />
                    </div>
                    {/* Password Strength Indicator */}
                    {newPassword.length > 0 && (
                      <div className="mt-2">
                        <div className="progress" style={{ height: '4px' }}>
                          <div className={`progress-bar ${newPassword.length > 8 ? 'bg-success w-100' : newPassword.length > 5 ? 'bg-warning w-50' : 'bg-danger w-25'}`}></div>
                        </div>
                        <span className="small text-muted mt-1 d-block">{newPassword.length > 8 ? 'Strong password' : 'Weak password'}</span>
                      </div>
                    )}
                  </div>
                  <div className="mb-5">
                    <label className="form-label text-muted small fw-bold text-uppercase">Confirm Password</label>
                    <div className="position-relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="form-control bg-light" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary px-5 py-2 fw-bold shadow-sm w-100 mb-3"
                    onClick={handlePasswordUpdate}
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {isUpdatingPassword ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Admin variant
export function AdminManagementPage() {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "users";
  
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => { loadData(); }, [currentTab]);

  const loadData = async () => {
    if (currentTab === "users") {
      const res = await getAllUsers();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } else if (currentTab === "products") {
      const res = await getAllProducts();
      setProducts(Array.isArray(res.data) ? res.data : []);
    }
  };

  const handleDeleteProduct = async (pid) => {
    if (!window.confirm("Admin: Force delete this listing?")) return;
    try {
      await deleteProduct(pid);
      toast.success("Listing removed");
      loadData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar d-none d-md-flex pb-4">
        <div className="p-4 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: '60px', height: '60px' }}>
              A
            </div>
            <div>
              <h6 className="fw-bold mb-0 text-main">Administrator</h6>
              <span className="text-danger small fw-bold">Admin Privileges</span>
            </div>
          </div>
        </div>
        
        <div className="flex-grow-1 py-3">
          <Link to="/admin" className="sidebar-link">
            <FiShield size={18} /> Control Panel
          </Link>
          <div className="px-4 py-2 mt-2 mb-1 text-uppercase small fw-bold text-muted" style={{ fontSize: '11px' }}>Management</div>
          <Link to="/admin/manage?tab=users" className={`sidebar-link ${currentTab === "users" ? "active" : ""}`}>
            <FiUser size={18} /> Manage Users
          </Link>
          <Link to="/admin/manage?tab=products" className={`sidebar-link ${currentTab === "products" ? "active" : ""}`}>
            <FiBox size={18} /> Manage Assets
          </Link>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container-fluid">
          <h4 className="fw-bold mb-4">{currentTab === 'users' ? 'User Directory' : 'Platform Assets'}</h4>
          
          <div className="card-custom bg-white border-0 shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table-clean">
                {currentTab === "users" ? (
                  <>
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.uid}>
                          <td><span className="fw-bold text-primary">#{u.uid}</span></td>
                          <td className="fw-bold">{u.fname} {u.lname}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger-subtle text-danger border border-danger' : 'bg-primary-subtle text-primary border border-primary'}`}>
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : (
                  <>
                    <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.pid}>
                          <td><span className="fw-bold text-primary">#{p.pid}</span></td>
                          <td className="fw-bold"><Link to={`/products/${p.pid}`} className="text-decoration-none text-main">{p.pname}</Link></td>
                          <td><span className="badge bg-light text-dark border">{p.type}</span></td>
                          <td>₹{p.price}</td>
                          <td>
                            <span className={`badge ${p.status === 'AVAILABLE' ? 'bg-success' : p.status === 'SOLD' ? 'bg-danger' : 'bg-secondary'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-outline-danger btn-sm p-1 rounded d-flex align-items-center" onClick={() => handleDeleteProduct(p.pid)}>
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
