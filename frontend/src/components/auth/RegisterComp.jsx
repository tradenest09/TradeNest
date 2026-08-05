import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";
import { toast } from "react-toastify";

export default function RegisterComp() {
  const [formData, setFormData] = useState({ fname: "", lname: "", uname: "", email: "", password: "", contactNumber: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message || "";
      const lowerMsg = backendMessage.toLowerCase();
      
      let displayMessage = "Registration failed. Please try again.";
      if (lowerMsg.includes("username already exists")) {
        displayMessage = "This username is already taken. Please choose another one.";
      } else if (lowerMsg.includes("email already exists")) {
        displayMessage = "An account with this email address already exists.";
      } else if (lowerMsg.includes("contact number already exists")) {
        displayMessage = "This phone number is already registered.";
      } else if (backendMessage) {
        displayMessage = backendMessage;
      }
      
      toast.error(displayMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-0 m-0 row g-0">
      
      {/* Left Section */}
      <div className="col-12 col-lg-6 p-0 m-0">
        <img src="/hero-illustration.png" alt="TradeNest Illustration" className="w-100 h-100" style={{ objectFit: 'cover' }} />
      </div>

      {/* Right Section */}
      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-lg-5" style={{ backgroundColor: '#f0f2f5' }}>
        <div className="card border-0 bg-white w-100" style={{ maxWidth: '520px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '40px' }}>
          
          <div className="text-center mb-4 pb-2">
            <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '2.2rem' }}>Create an Account</h2>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Fill in the details below to get started</p>
          </div>

          <form onSubmit={handleRegister}>
            
            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label className="form-label text-dark mb-2" style={{ fontWeight: '500' }}>First Name</label>
                <input type="text" className="form-control form-control-lg border-0 shadow-none" name="fname" value={formData.fname} onChange={handleChange} required 
                       style={{ backgroundColor: '#eef2f6', borderRadius: '12px', fontSize: '15px', padding: '12px 16px' }} />
              </div>
              <div className="col-sm-6">
                <label className="form-label text-dark mb-2" style={{ fontWeight: '500' }}>Last Name</label>
                <input type="text" className="form-control form-control-lg border-0 shadow-none" name="lname" value={formData.lname} onChange={handleChange} required 
                       style={{ backgroundColor: '#eef2f6', borderRadius: '12px', fontSize: '15px', padding: '12px 16px' }} />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-dark mb-2" style={{ fontWeight: '500' }}>Username</label>
              <input type="text" className="form-control form-control-lg border-0 shadow-none" name="uname" value={formData.uname} onChange={handleChange} minLength={4} required 
                     style={{ backgroundColor: '#eef2f6', borderRadius: '12px', fontSize: '15px', padding: '12px 16px' }} />
            </div>

            <div className="mb-3">
              <label className="form-label text-dark mb-2" style={{ fontWeight: '500' }}>Email address</label>
              <input type="email" className="form-control form-control-lg border-0 shadow-none" name="email" value={formData.email} onChange={handleChange} required 
                     style={{ backgroundColor: '#eef2f6', borderRadius: '12px', fontSize: '15px', padding: '12px 16px' }} />
            </div>

            <div className="mb-3">
              <label className="form-label text-dark mb-2" style={{ fontWeight: '500' }}>Phone Number</label>
              <input type="tel" className="form-control form-control-lg border-0 shadow-none" name="contactNumber" value={formData.contactNumber} onChange={handleChange} pattern="[0-9]{10}" title="Must be a valid 10-digit phone number" required 
                     style={{ backgroundColor: '#eef2f6', borderRadius: '12px', fontSize: '15px', padding: '12px 16px' }} />
            </div>

            <div className="mb-3">
              <label className="form-label text-dark mb-2" style={{ fontWeight: '500' }}>Password</label>
              <input type="password" className="form-control form-control-lg border-0 shadow-none" name="password" value={formData.password} onChange={handleChange} minLength={6} required 
                     style={{ backgroundColor: '#eef2f6', borderRadius: '12px', fontSize: '15px', padding: '12px 16px' }} />
            </div>
            
            <div className="mb-4">
              <label className="form-label text-dark mb-2" style={{ fontWeight: '500' }}>Confirm Password</label>
              <input type="password" className="form-control form-control-lg border-0 shadow-none" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
                     style={{ backgroundColor: '#eef2f6', borderRadius: '12px', fontSize: '15px', padding: '12px 16px' }} />
            </div>

            <button 
              type="submit" 
              className="btn w-100 shadow-sm d-flex justify-content-center align-items-center gap-2 mt-4 text-white" 
              style={{ height: '54px', borderRadius: '12px', fontSize: '17px', fontWeight: '500', backgroundColor: '#0d6efd', border: 'none' }}
              disabled={loading}
            >
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '15px' }}>
              Already have an account? <Link to="/login" className="text-primary text-decoration-none ms-1" style={{ fontWeight: '500' }}>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}