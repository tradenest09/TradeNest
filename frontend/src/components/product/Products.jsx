import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import ProductCard from "./ProductCard";
import { FiFilter, FiSearch, FiSliders } from "react-icons/fi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    loadData();
    // Update local state when URL changes
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "");
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch all products once so we can perform robust client-side filtering 
      // across both product names and category names without missing matches.
      const [prodRes, catRes] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);
      
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedType("");
    setPriceRange("");
    navigate("/products");
  };

  const handleSidebarSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchParams.set("search", searchQuery.trim());
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  // Local Filter Logic (Search, Category, Type, Price)
  const filteredProducts = products.filter(p => {
    // 1. Intelligent Search (matches product name OR category name, case-insensitive, partial matching)
    let matchesSearch = true;
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.pname && p.pname.toLowerCase().includes(q);
      const matchCat = p.categoryName && p.categoryName.toLowerCase().includes(q);
      matchesSearch = matchName || matchCat;
    }

    // 2. Sidebar Category
    const matchesCategory = selectedCategory ? p.categoryName === selectedCategory : true;
    
    // 3. Sidebar Type
    const matchesType = selectedType ? p.type === selectedType : true;
    
    // 4. Sidebar Price
    let matchesPrice = true;
    if (priceRange === "under1000") matchesPrice = p.price < 1000;
    else if (priceRange === "1000to5000") matchesPrice = p.price >= 1000 && p.price <= 5000;
    else if (priceRange === "above5000") matchesPrice = p.price > 5000;

    return matchesSearch && matchesCategory && matchesType && matchesPrice;
  });

  return (
    <div className="container py-4 min-vh-100">
      
      {/* Breadcrumbs */}
      <div className="mb-4 text-muted small">
        <span className="hover-primary cursor-pointer">Home</span> <span className="mx-2">/</span>
        <span className="text-main fw-bold">All Categories</span>
      </div>

      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3 mb-4">
          <div className="card-custom bg-white p-4 border-0 shadow-sm sticky-top" style={{ top: '90px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FiSliders /> Filters
              </h5>
              <button className="btn btn-link text-primary text-decoration-none p-0 fw-bold small" onClick={clearFilters}>
                Clear All
              </button>
            </div>
            
            <div className="mb-4">
              <form onSubmit={handleSidebarSearch} className="search-container border shadow-none bg-white d-flex">
                <input type="text" className="search-input py-2 flex-grow-1" placeholder="Search ads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button type="submit" className="btn btn-link text-muted px-3 p-0 m-0 text-decoration-none">
                  <FiSearch />
                </button>
              </form>
            </div>

            <div className="mb-4 border-bottom pb-4">
              <h6 className="fw-bold mb-3 text-uppercase small text-muted">Categories</h6>
              <div className="d-flex flex-column gap-2">
                <div className="form-check custom-radio">
                  <input className="form-check-input" type="radio" name="category" id="cat-all" value="" checked={selectedCategory === ""} onChange={() => setSelectedCategory("")} />
                  <label className="form-check-label text-main" htmlFor="cat-all">All Categories</label>
                </div>
                {categories.map(c => (
                  <div className="form-check custom-radio" key={c.cid}>
                    <input className="form-check-input" type="radio" name="category" id={`cat-${c.cid}`} value={c.cname} checked={selectedCategory === c.cname} onChange={() => setSelectedCategory(c.cname)} />
                    <label className="form-check-label text-main" htmlFor={`cat-${c.cid}`}>{c.cname}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 border-bottom pb-4">
              <h6 className="fw-bold mb-3 text-uppercase small text-muted">Listing Type</h6>
              <div className="d-flex flex-column gap-2">
                <div className="form-check custom-radio">
                  <input className="form-check-input" type="radio" name="type" id="type-all" value="" checked={selectedType === ""} onChange={() => setSelectedType("")} />
                  <label className="form-check-label text-main" htmlFor="type-all">Any</label>
                </div>
                <div className="form-check custom-radio">
                  <input className="form-check-input" type="radio" name="type" id="type-sell" value="SELL" checked={selectedType === "SELL"} onChange={() => setSelectedType("SELL")} />
                  <label className="form-check-label text-main" htmlFor="type-sell">For Sale</label>
                </div>
                <div className="form-check custom-radio">
                  <input className="form-check-input" type="radio" name="type" id="type-rent" value="RENT" checked={selectedType === "RENT"} onChange={() => setSelectedType("RENT")} />
                  <label className="form-check-label text-main" htmlFor="type-rent">For Rent</label>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <h6 className="fw-bold mb-3 text-uppercase small text-muted">Price Range</h6>
              <select className="form-select border-0 bg-light fw-medium" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="">Any Price</option>
                <option value="under1000">Under ₹1,000</option>
                <option value="1000to5000">₹1,000 - ₹5,000</option>
                <option value="above5000">Above ₹5,000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content (Product Grid) */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">
              {selectedCategory ? `${selectedCategory} in India` : "Fresh recommendations"}
            </h4>
            <span className="text-muted fw-medium">{filteredProducts.length} Results</span>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="row g-3">
              {filteredProducts.map(product => (
                <div className="col-md-6 col-lg-4" key={product.pid}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card-custom bg-white p-5 text-center border-0 shadow-sm mt-3">
              <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <FiFilter size={32} className="text-muted" />
              </div>
              <h4 className="fw-bold">No results found</h4>
              <p className="text-muted">Try adjusting your filters or search query to find what you're looking for.</p>
              <button className="btn btn-primary fw-bold px-4" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}