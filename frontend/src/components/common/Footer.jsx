import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-white border-top pt-5 pb-3" style={{ borderTopColor: 'var(--border-color) !important' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: '13px' }}>Popular Locations</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">Pune</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">Mumbai</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">Bangalore</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">Delhi</Link></li>
            </ul>
          </div>
          
          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: '13px' }}>Trending Locations</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">Hyderabad</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">Chennai</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">Kolkata</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">Ahmedabad</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: '13px' }}>About TradeNest</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">About Us</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">Careers</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">Contact Us</Link></li>
              <li><Link to="/" className="text-muted text-decoration-none small hover-primary">TradeNest for Business</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: '13px' }}>Follow Us</h6>
            <div className="d-flex gap-3 mb-3">
              <a href="#" className="text-muted hover-primary"><FiFacebook size={20} /></a>
              <a href="#" className="text-muted hover-primary"><FiTwitter size={20} /></a>
              <a href="#" className="text-muted hover-primary"><FiInstagram size={20} /></a>
              <a href="#" className="text-muted hover-primary"><FiLinkedin size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-top pt-3 mt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="d-flex gap-3 mb-2 mb-md-0">
            <span className="text-main fw-bold d-flex align-items-center gap-1" style={{ fontSize: '14px' }}>
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px', backgroundColor: 'var(--primary-color)' }}>
                <span className="text-white fw-bold" style={{ fontSize: '12px' }}>T</span>
              </div>
              TradeNest
            </span>
          </div>
          <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
            All rights reserved &copy; {new Date().getFullYear()} TradeNest.
          </p>
        </div>
      </div>
    </footer>
  );
}