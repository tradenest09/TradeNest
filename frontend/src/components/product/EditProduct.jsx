import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProductById, updateProduct } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import { FiArrowLeft, FiEdit3, FiInfo, FiTag, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";

export default function EditProduct() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    cid: "",
    pname: "",
    pdesc: "",
    price: "",
    status: "",
    type: ""
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const categoryResponse = await getAllCategories();
      setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : []);
      const productResponse = await getProductById(pid);
      const product = productResponse.data || {};
      setFormData({
        cid: product.cid || "",
        pname: product.pname || "",
        pdesc: product.pdesc || "",
        price: product.price || "",
        status: product.status || "",
        type: product.type || ""
      });
    } catch {
      toast.error("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProduct(pid, formData);
      toast.success("Listing updated successfully!");
      navigate("/dashboard?tab=products");
    } catch {
      toast.error("Failed to update listing.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-color">
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
    </div>
  );

  return (
    <div className="bg-color min-vh-100 py-5">
      <div className="container max-w-4xl" style={{ maxWidth: '800px' }}>
        
        <Link to="/dashboard?tab=products" className="text-decoration-none text-main d-inline-flex align-items-center gap-2 mb-4 hover-primary fw-medium">
          <FiArrowLeft /> Back to My Listings
        </Link>

        <div className="card-custom bg-white border-0 shadow-sm p-4 p-md-5">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <FiEdit3 className="text-warning" size={24} />
            </div>
            <h2 className="fw-bold mb-0">Edit Ad</h2>
          </div>
          <p className="text-muted ms-5 ps-3 mb-5">Update the details of your active listing.</p>

          <form onSubmit={handleSubmit}>
            
            {/* Basic Info */}
            <div className="mb-5">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FiInfo className="text-primary" /> Include some details
              </h6>
              
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Ad Title *</label>
                <input type="text" className="form-control" name="pname" value={formData.pname} onChange={handleChange} required />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase d-flex align-items-center gap-2">
                  <FiFileText /> Description *
                </label>
                <textarea className="form-control" rows="5" name="pdesc" value={formData.pdesc} onChange={handleChange} required />
              </div>
            </div>

            {/* Category & Price */}
            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FiTag className="text-primary" /> Set a price
                </h6>
                <label className="form-label small fw-bold text-muted text-uppercase">Price (₹) *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 fw-bold">₹</span>
                  <input type="number" className="form-control border-start-0 ps-0" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
                </div>
              </div>

              <div className="col-md-6">
                <h6 className="fw-bold mb-3 text-white d-none d-md-block">.</h6>
                <label className="form-label small fw-bold text-muted text-uppercase">Category *</label>
                <select className="form-select" name="cid" value={formData.cid} onChange={handleChange} required>
                  {categories.map(c => <option key={c.cid} value={c.cid}>{c.cname}</option>)}
                </select>
              </div>
            </div>

            {/* Settings */}
            <div className="p-4 bg-light rounded border mb-5">
              <h6 className="fw-bold mb-4">Listing Preferences</h6>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Type of Ad</label>
                  <select className="form-select bg-white" name="type" value={formData.type} onChange={handleChange}>
                    <option value="SELL">For Sale</option>
                    <option value="RENT">For Rent</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Current Status</label>
                  <select className="form-select bg-white" name="status" value={formData.status} onChange={handleChange}>
                    <option value="AVAILABLE">Available</option>
                    <option value="SOLD">Sold</option>
                    <option value="RENTED">Rented</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="my-5" />

            <div className="d-flex justify-content-end gap-3">
              <Link to="/dashboard?tab=products" className="btn btn-light px-4 fw-bold">Cancel</Link>
              <button type="submit" className="btn btn-primary px-5 fw-bold shadow-sm" disabled={saving}>
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}