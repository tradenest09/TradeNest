import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { addProduct, addRent, uploadProductImage } from "../../api/productApi";
import { getAllCategories, addCategory } from "../../api/categoryApi";
import { FiArrowLeft, FiUploadCloud, FiInfo, FiTag, FiFileText, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    uid: user?.uid || "",
    cid: "",
    pname: "",
    pdesc: "",
    price: "",
    securityDeposit: "",
    status: "AVAILABLE",
    type: "SELL"
  });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate count
    if (images.length + files.length > 5) {
      toast.warning("You can only upload a maximum of 5 images.");
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file format: ${file.name}. Only JPG, PNG, WEBP allowed.`);
        return false;
      }
      return true;
    });

    // Create preview URLs
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
    e.target.value = null; // Reset input so same file can be selected again if removed
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => images.forEach(img => URL.revokeObjectURL(img.preview));
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNewCategory && !formData.cid) { toast.warning("Please select a category."); return; }
    if (isNewCategory && !newCategoryName.trim()) { toast.warning("Please enter a category name."); return; }
    
    // Validation
    if (formData.type === "RENT") {
      if (!formData.securityDeposit || Number(formData.securityDeposit) < 0) {
        toast.warning("Security Deposit must be 0 or a positive number.");
        return;
      }
      if (Number(formData.price) <= 0) {
        toast.warning("Rent Per Day must be greater than zero.");
        return;
      }
    } else {
      if (Number(formData.price) <= 0) {
        toast.warning("Selling Price must be greater than zero.");
        return;
      }
    }
    
    setLoading(true);
    try {
      let finalCid = formData.cid;
      
      if (isNewCategory) {
        const catRes = await addCategory({ cname: newCategoryName.trim() });
        finalCid = catRes.data.cid;
      }

      // Step 1: Add Product (Using price as either Selling Price or Rent Per Day)
      const prodRes = await addProduct({ 
        uid: formData.uid,
        cid: finalCid,
        pname: formData.pname,
        pdesc: formData.pdesc,
        price: formData.price,
        status: formData.status,
        type: formData.type
      });
      
      const newPid = prodRes.data.pid;

      // Step 2: Add Rent Details if type is RENT
      if (formData.type === "RENT") {
        await addRent({
          pid: newPid,
          noOfDays: 1, // Default min days allowed by the owner
          chargePerDay: formData.price,
          securityDeposit: formData.securityDeposit
        });
      }

      // Step 3: Upload Images
      if (images.length > 0) {
        setUploadingImages(true);
        try {
          for (const img of images) {
            const fd = new FormData();
            fd.append("file", img.file);
            await uploadProductImage(newPid, fd);
          }
          toast.success("Images uploaded successfully!");
        } catch (imgError) {
          toast.error("Product created, but some images failed to upload.");
        } finally {
          setUploadingImages(false);
        }
      }

      toast.success("Listing published successfully!");
      navigate("/dashboard?tab=products");
    } catch {
      toast.error("Failed to publish listing.");
    } finally {
      setLoading(false);
    }
  };

  const isRent = formData.type === "RENT";

  return (
    <div className="bg-color min-vh-100 py-5">
      <div className="container max-w-4xl" style={{ maxWidth: '800px' }}>
        
        <Link to="/dashboard?tab=products" className="text-decoration-none text-main d-inline-flex align-items-center gap-2 mb-4 hover-primary fw-medium">
          <FiArrowLeft /> Back to My Listings
        </Link>

        <div className="card-custom bg-white border-0 shadow-sm p-4 p-md-5">
          <div className="mb-5 text-center">
            <h2 className="fw-bold mb-2">Post an Ad</h2>
            <p className="text-muted">Fill in the details below to publish your listing on TradeNest.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Listing Preferences */}
            <div className="p-4 bg-light rounded border mb-4">
              <h6 className="fw-bold mb-4">Listing Preferences</h6>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Type of Ad</label>
                  <div className="d-flex gap-4">
                    <div className="form-check custom-radio">
                      <input className="form-check-input" type="radio" name="type" id="typeSell" value="SELL" checked={formData.type === "SELL"} onChange={handleChange} />
                      <label className="form-check-label text-main fw-medium" htmlFor="typeSell">For Sale</label>
                    </div>
                    <div className="form-check custom-radio">
                      <input className="form-check-input" type="radio" name="type" id="typeRent" value="RENT" checked={formData.type === "RENT"} onChange={handleChange} />
                      <label className="form-check-label text-main fw-medium" htmlFor="typeRent">For Rent</label>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Initial Status</label>
                  <select className="form-select bg-white" name="status" value={formData.status} onChange={handleChange}>
                    <option value="AVAILABLE">Available</option>
                    <option value="SOLD">Sold</option>
                    <option value="RENTED">Rented</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="mb-5">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FiInfo className="text-primary" /> Include some details
              </h6>
              
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Ad Title *</label>
                <input type="text" className="form-control" name="pname" value={formData.pname} onChange={handleChange} placeholder="Mention the key features of your item (e.g. brand, model)" required />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase d-flex align-items-center gap-2">
                  <FiFileText /> Description *
                </label>
                <textarea className="form-control" rows="5" name="pdesc" value={formData.pdesc} onChange={handleChange} placeholder="Include condition, features and reason for selling" required />
              </div>
            </div>

            {/* Category & Price */}
            <div className="row g-4 mb-5">
              
              <div className="col-md-12">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FiTag className="text-primary" /> Set your price
                </h6>
              </div>

              <div className={isRent ? "col-md-6" : "col-md-12"}>
                <label className="form-label small fw-bold text-muted text-uppercase">{isRent ? "Rent Per Day (₹) *" : "Selling Price (₹) *"}</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 fw-bold">₹</span>
                  <input type="number" className="form-control border-start-0 ps-0" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" min="0" step="0.01" required />
                </div>
              </div>

              {isRent && (
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase d-flex align-items-center gap-1">
                    Security Deposit (₹) * <FiInfo className="text-primary ms-1" title="Refundable amount collected during rental." />
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 fw-bold">₹</span>
                    <input type="number" className="form-control border-start-0 ps-0" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} placeholder="0.00" min="0" step="0.01" required />
                  </div>
                  <small className="text-primary mt-1 d-block fw-medium">
                    This amount is refundable after the product is returned in good condition.
                  </small>
                </div>
              )}

              <div className="col-md-12 mt-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Category *</label>
                <select 
                  className={`form-select ${isNewCategory ? 'mb-2' : ''}`} 
                  name="cid" 
                  value={isNewCategory ? "new" : formData.cid} 
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setIsNewCategory(true);
                      setFormData({ ...formData, cid: "" });
                    } else {
                      setIsNewCategory(false);
                      handleChange(e);
                    }
                  }} 
                  required={!isNewCategory}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => <option key={c.cid} value={c.cid}>{c.cname}</option>)}
                  <option value="new" className="text-primary fw-bold">+ Add New Category</option>
                </select>
                
                {isNewCategory && (
                  <input 
                    type="text" 
                    className="form-control mt-2 border-primary" 
                    placeholder="Enter new category name..." 
                    value={newCategoryName} 
                    onChange={(e) => setNewCategoryName(e.target.value)} 
                    required 
                    autoFocus
                  />
                )}
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FiUploadCloud className="text-primary" /> Photos (Max 5)
              </h6>
              
              {images.length > 0 && (
                <div className="row g-3 mb-3">
                  {images.map((img, index) => (
                    <div key={index} className="col-auto">
                      <div className="position-relative border rounded overflow-hidden shadow-sm" style={{ width: '100px', height: '100px' }}>
                        <img src={img.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)}
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 p-1 m-1 rounded-circle"
                          style={{ lineHeight: 0 }}
                          title="Remove image"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {images.length < 5 && (
                <div className="border border-2 border-dashed rounded bg-light p-5 text-center position-relative cursor-pointer hover-bg-gray transition-all">
                  <FiUploadCloud size={40} className="text-muted mb-3" />
                  <h6 className="fw-bold text-main">Click to upload photos</h6>
                  <p className="text-muted small mb-0">Adding photos increases your chances of selling quickly. (JPG, PNG, WEBP)</p>
                  <input 
                    type="file" 
                    className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" 
                    onChange={handleImageSelect}
                    multiple
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                  />
                </div>
              )}
            </div>

            <hr className="my-5" />

            <div className="d-flex justify-content-end gap-3">
              <Link to="/dashboard?tab=products" className="btn btn-light px-4 fw-bold">Cancel</Link>
              <button type="submit" className="btn btn-primary px-5 fw-bold shadow-sm d-flex align-items-center gap-2" disabled={loading || uploadingImages}>
                {(loading || uploadingImages) && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                {uploadingImages ? "Uploading Images..." : loading ? "Publishing..." : "Post Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}