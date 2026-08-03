import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { getProductsBySeller } from "../../api/productApi";
import { getUserById, updateUser, getAllUsers, deleteUser } from "../../api/userApi";
import { getAllCategories, addCategory, deleteCategory } from "../../api/categoryApi";
import { getAllProducts, deleteProduct } from "../../api/productApi";
import { getAllPurchases, getAllRentals, getPurchasesByBuyer, getPurchasesBySeller, getRentalsByRenter, getRentalsByOwner, updateRentalStatus, cancelPurchase, cancelRental } from "../../api/orderApi";

const rupee = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value || 0);

function Spinner() { return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>; }
function Failure({ message }) { return <div className="alert alert-danger">{message}</div>; }
function Empty({ children }) { return <div className="alert alert-info">{children}</div>; }

export function UserAccountPage() {
  const { user } = useSelector((state) => state.auth);
  const [section, setSection] = useState("listings");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(user);
  const [saved, setSaved] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      if (section === "listings") setItems((await getProductsBySeller(user.uid)).data);
      if (section === "purchases") setItems((await getPurchasesByBuyer(user.uid)).data);
      if (section === "sales") setItems((await getPurchasesBySeller(user.uid)).data);
      if (section === "rentals") setItems((await getRentalsByRenter(user.uid)).data);
      if (section === "requests") setItems((await getRentalsByOwner(user.uid)).data);
      if (section === "profile") setProfile((await getUserById(user.uid)).data);
    } catch { setError("Unable to load this information. Please try again."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [section]);
  const saveProfile = async (event) => { event.preventDefault(); try { const response = await updateUser(user.uid, { fname: profile.fname, lname: profile.lname, contactNumber: profile.contactNumber }); setProfile(response.data); setSaved("Profile updated successfully."); } catch { setError("Unable to update your profile."); } };
  const updateRequest = async (id, status) => { try { await updateRentalStatus({ rentalId: id, status }); load(); } catch { setError("Unable to update rental status."); } };
  const removeListing = async (id) => { if (!window.confirm("Delete this listing?")) return; try { await deleteProduct(id); load(); } catch { setError("Unable to delete this listing."); } };
  return <div className="container mt-5"><h2>Welcome {user?.fname || "User"}</h2><p className="text-muted">Manage your TradeNest activity in one place.</p><div className="row mt-4"><aside className="col-lg-3 mb-3"><div className="list-group">{[["listings","My Listings"],["purchases","Purchased Products"],["sales","Sold Products"],["rentals","My Rentals"],["requests","Rental Requests"],["profile","My Profile"]].map(([key,label]) => <button key={key} className={`list-group-item list-group-item-action ${section === key ? "active" : ""}`} onClick={() => setSection(key)}>{label}</button>)}</div></aside><section className="col-lg-9"><div className="card shadow-sm p-4">{error && <Failure message={error} />}{loading ? <Spinner /> : section === "profile" ? <form onSubmit={saveProfile}><h4>My Profile</h4>{saved && <div className="alert alert-success">{saved}</div>}<div className="row"><div className="col-md-6 mb-3"><label>First name</label><input required className="form-control" value={profile?.fname || ""} onChange={(e) => setProfile({...profile,fname:e.target.value})}/></div><div className="col-md-6 mb-3"><label>Last name</label><input required className="form-control" value={profile?.lname || ""} onChange={(e) => setProfile({...profile,lname:e.target.value})}/></div></div><div className="mb-3"><label>Email</label><input className="form-control" value={profile?.email || ""} disabled /></div><div className="mb-3"><label>Contact number</label><input required className="form-control" value={profile?.contactNumber || ""} onChange={(e) => setProfile({...profile,contactNumber:e.target.value})}/></div><button className="btn btn-primary">Save Profile</button></form> : section === "listings" ? <><div className="d-flex justify-content-between"><h4>My Listings</h4><Link to="/products/add" className="btn btn-primary btn-sm">Add Product</Link></div>{items.length ? <div className="table-responsive mt-3"><table className="table"><thead><tr><th>Name</th><th>Price</th><th>Status</th><th /></tr></thead><tbody>{items.map((p) => <tr key={p.pid}><td>{p.pname}</td><td>{rupee(p.price)}</td><td>{p.status}</td><td><Link className="btn btn-sm btn-outline-warning me-2" to={`/products/edit/${p.pid}`}>Edit</Link><button className="btn btn-sm btn-outline-danger" onClick={() => removeListing(p.pid)}>Delete</button></td></tr>)}</tbody></table></div> : <Empty>You have no listings yet.</Empty>}</> : <Transactions title={section === "purchases" ? "Purchased Products" : section === "sales" ? "Sold Products" : section === "rentals" ? "My Rentals" : "Rental Requests"} items={items} rental={section === "rentals" || section === "requests"} owner={section === "requests"} onStatus={updateRequest} onCancel={async (id) => { try { section === "purchases" ? await cancelPurchase(id) : await cancelRental(id); load(); } catch { setError("Unable to cancel this transaction."); } }} />}</div></section></div></div>;
}

function Transactions({ title, items, rental, owner, onStatus, onCancel }) {
  if (!items.length) return <><h4>{title}</h4><Empty>No records found.</Empty></>;
  return <><h4>{title}</h4><div className="table-responsive mt-3"><table className="table"><thead><tr><th>Product</th><th>{rental ? "Dates" : "Amount"}</th><th>Status</th><th /></tr></thead><tbody>{items.map((item) => <tr key={rental ? item.rentalId : item.purchaseId}><td>#{item.pid}</td><td>{rental ? `${item.startDate} to ${item.endDate}` : rupee(item.amount)}</td><td>{item.status}</td><td>{owner && item.status === "REQUESTED" && <><button className="btn btn-sm btn-success me-1" onClick={() => onStatus(item.rentalId, "APPROVED")}>Approve</button><button className="btn btn-sm btn-danger" onClick={() => onStatus(item.rentalId, "CANCELLED")}>Decline</button></>}{!owner && ["PENDING", "REQUESTED"].includes(item.status) && <button className="btn btn-sm btn-outline-danger" onClick={() => onCancel(rental ? item.rentalId : item.purchaseId)}>Cancel</button>}</td></tr>)}</tbody></table></div></>;
}

export function AdminManagementPage() {
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState(["users", "products", "purchases", "rentals", "categories"].includes(requestedTab) ? requestedTab : "users"); const [items, setItems] = useState([]); const [categories, setCategories] = useState([]); const [name, setName] = useState(""); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = async () => { setLoading(true); setError(""); try { if (tab === "users") setItems((await getAllUsers()).data); if (tab === "products") setItems((await getAllProducts()).data); if (tab === "purchases") setItems((await getAllPurchases()).data); if (tab === "rentals") setItems((await getAllRentals()).data); if (tab === "categories") setCategories((await getAllCategories()).data); } catch { setError("Unable to load administration data."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [tab]);
  const add = async (event) => { event.preventDefault(); try { await addCategory({ cname: name, description: "" }); setName(""); load(); } catch { setError("Unable to add category."); } };
  const erase = async (id) => { if (!window.confirm("Delete this record?")) return; try { if (tab === "users") await deleteUser(id); if (tab === "products") await deleteProduct(id); if (tab === "categories") await deleteCategory(id); load(); } catch { setError("This record cannot be deleted because it is in use."); } };
  return <div className="container mt-5"><h2>TradeNest Admin Panel</h2><div className="btn-group my-4 flex-wrap">{[["users","Users"],["products","Products"],["purchases","Orders"],["rentals","Rentals"],["categories","Categories"]].map(([key,label]) => <button key={key} onClick={() => setTab(key)} className={`btn ${tab === key ? "btn-dark" : "btn-outline-dark"}`}>{label}</button>)}</div><div className="card shadow-sm p-4">{error && <Failure message={error}/>} {loading ? <Spinner/> : tab === "categories" ? <><form className="row g-2 mb-4" onSubmit={add}><div className="col-sm-8"><input required className="form-control" placeholder="Category name" value={name} onChange={(e)=>setName(e.target.value)}/></div><div className="col-sm-4"><button className="btn btn-primary w-100">Add Category</button></div></form><Transactions title="Categories" items={categories.map(c => ({purchaseId:c.cid,pid:c.cname,amount:c.description,status:"ACTIVE"}))}/><div>{categories.map(c => <button key={c.cid} onClick={()=>erase(c.cid)} className="btn btn-sm btn-outline-danger me-2">Delete {c.cname}</button>)}</div></> : <AdminTable tab={tab} items={items} erase={erase}/>}</div></div>;
}
function AdminTable({ tab, items, erase }) { return <div className="table-responsive"><table className="table"><thead><tr>{tab === "users" ? <><th>User</th><th>Email</th><th>Role</th><th /></> : <><th>Product</th><th>Details</th><th>Status</th><th /></>}</tr></thead><tbody>{items.map((item) => <tr key={item.uid || item.pid || item.purchaseId || item.rentalId}><td>{tab === "users" ? `${item.fname} ${item.lname}` : `#${item.pid}`}</td><td>{tab === "users" ? item.email : rupee(item.amount || item.price || item.totalAmount)}</td><td>{tab === "users" ? item.role : item.status}</td><td>{["users","products"].includes(tab) && <button className="btn btn-sm btn-outline-danger" onClick={()=>erase(item.uid || item.pid)}>Delete</button>}</td></tr>)}</tbody></table>{!items.length && <Empty>No records found.</Empty>}</div>; }



