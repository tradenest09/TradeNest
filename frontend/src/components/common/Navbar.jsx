import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { FiSearch, FiHeart, FiMessageSquare, FiUser, FiPlus, FiMenu, FiCpu } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate(`/products`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-white sticky-top shadow-sm border-bottom border-light" style={{ zIndex: 1020 }}>
        <div className="container py-2 d-flex align-items-center justify-content-between gap-4">
          
          {/* Brand Logo */}
          <Link className="text-decoration-none d-flex align-items-center gap-2" to="/">
            <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)' }}>
              <span className="text-white fw-bold fs-5">T</span>
            </div>
            <span className="fw-bold fs-4 d-none d-md-block" style={{ color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              TradeNest
            </span>
          </Link>

          {/* Main Search Bar (Extended & Improved) */}
          <div className="flex-grow-1" style={{ maxWidth: '800px' }}>
            <form onSubmit={handleSearchSubmit} className="d-flex w-100 border border-2 border-primary rounded overflow-hidden">
              <input 
                type="text" 
                className="form-control border-0 shadow-none px-3 py-2" 
                placeholder="Find Cars, Mobile Phones and more..." 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ fontSize: '15px' }}
              />
              <button type="submit" className="btn btn-primary border-0 rounded-0 px-4 d-flex align-items-center justify-content-center hover-opacity">
                <FiSearch size={20} className="text-white" />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-4">
            <Link to="/ai-assistant" className="text-decoration-none text-main d-flex flex-column align-items-center gap-1 hover-primary" style={{ transition: 'color 0.2s', color: 'var(--text-main)' }}>
              <FiCpu size={24} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>AI Assistant</span>
            </Link>

            <Link to="/wishlist" className="text-decoration-none text-main d-flex flex-column align-items-center gap-1 hover-primary" style={{ transition: 'color 0.2s', color: 'var(--text-main)' }}>
              <FiHeart size={24} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Wishlist</span>
            </Link>

            {!isAuthenticated ? (
              <Link to="/login" className="text-decoration-none text-main fw-bold ms-2" style={{ textDecoration: 'underline !important' }}>
                Login
              </Link>
            ) : (
              <div className="dropdown">
                <div className="d-flex align-items-center gap-2 cursor-pointer dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{ cursor: 'pointer' }}>
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center border shadow-sm" style={{ width: '42px', height: '42px' }}>
                    <FiUser className="text-muted" size={22} />
                  </div>
                </div>
                <ul className="dropdown-menu dropdown-menu-end shadow-md border-0 mt-2" style={{ minWidth: '220px', borderRadius: 'var(--radius-md)' }}>
                  <li className="px-3 py-2 border-bottom mb-2">
                    <div className="fw-bold text-main">{user?.fname} {user?.lname}</div>
                    <Link to="/dashboard" className="text-primary text-decoration-none small fw-medium">View and edit profile</Link>
                  </li>
                  <li><Link className="dropdown-item py-2 fw-medium" to="/dashboard?tab=products">My ADS</Link></li>
                  <li><Link className="dropdown-item py-2 fw-medium" to="/dashboard?tab=purchases">My Orders</Link></li>
                  {user?.role === "ADMIN" && (
                    <li><Link className="dropdown-item py-2 fw-medium text-primary" to="/admin">Admin Panel</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item py-2 fw-medium text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            )}

            <Link to="/products/add" className="btn btn-primary d-flex align-items-center gap-1 text-decoration-none ms-2 shadow-sm rounded-pill px-4" style={{ fontWeight: 600, transition: 'all 0.2s' }}>
              <FiPlus size={20} className="text-white" /> <span className="text-white">SELL</span>
            </Link>
          </div>
        </div>
      </nav>


    </>
  );
}
