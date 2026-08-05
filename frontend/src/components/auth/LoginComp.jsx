import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../../redux/authSlice";
import { login as loginApi } from "../../api/authApi";
import { toast } from "react-toastify";

export default function LoginComp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginApi({
  email,
  password,
});
      dispatch(
  loginAction({
    token: response.data.token,
    user: {
      uid: response.data.uid,
      uname: response.data.uname,
      email: response.data.email,
      contactNumber: response.data.contactNumber,
      fname: response.data.fname,
      lname: response.data.lname,
      role: response.data.role,
      status: response.data.status,
    },
  })
);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
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
        <div className="card border-0 bg-white w-100" style={{ maxWidth: '480px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '48px 40px' }}>
          
          <div className="text-center mb-4 pb-2">
            <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '2.2rem' }}>Welcome Back</h2>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Login to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label text-dark mb-2" style={{ fontWeight: '500' }}>Email</label>
              <input 
                type="email" 
                className="form-control form-control-lg border-0 shadow-none" 
                placeholder="name@example.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ backgroundColor: '#eef2f6', borderRadius: '12px', fontSize: '15px', padding: '14px 16px' }}
              />
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <label className="form-label text-dark mb-0" style={{ fontWeight: '500' }}>Password</label>
                <Link to="/forgot-password" className="text-primary text-decoration-none" style={{ fontSize: '14px' }}>Forgot Password?</Link>
              </div>
              <input 
                type="password" 
                className="form-control form-control-lg border-0 shadow-none" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ backgroundColor: '#eef2f6', borderRadius: '12px', fontSize: '15px', padding: '14px 16px' }}
              />
            </div>

            <div className="mb-4 pb-2 form-check d-flex align-items-center">
              <input type="checkbox" className="form-check-input shadow-none cursor-pointer m-0 me-2" id="rememberMe" style={{ width: '18px', height: '18px' }} />
              <label className="form-check-label text-muted cursor-pointer pt-1" htmlFor="rememberMe" style={{ fontSize: '14px' }}>Remember Me</label>
            </div>

            <button 
              type="submit" 
              className="btn w-100 shadow-sm d-flex justify-content-center align-items-center gap-2 text-white" 
              style={{ height: '54px', borderRadius: '12px', fontSize: '17px', fontWeight: '500', backgroundColor: '#0d6efd', border: 'none' }}
              disabled={loading}
            >
              {loading ? <span className="spinner-border spinner-border-sm" /> : null}
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-muted mt-4 pt-3 mb-0" style={{ fontSize: '15px' }}>
              Don't have an account? <Link to="/register" className="text-primary text-decoration-none ms-1" style={{ fontWeight: '500' }}>Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}