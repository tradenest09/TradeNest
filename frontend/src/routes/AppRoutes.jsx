import { Routes, Route } from "react-router-dom";
import LoginComp from "../components/auth/LoginComp";
import RegisterComp from "../components/auth/RegisterComp";
import LogoutComp from "../components/auth/LogoutComp";
import HomeComp from "../components/home/HomeComp";
import UserDashboard from "../components/user/UserDashboard";
import AdminDashboard from "../components/admin/AdminDashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Products from "../components/product/Products";
import ProductDetails from "../components/product/ProductDetails";
import EditProduct from "../components/product/EditProduct";
import AddProduct from "../components/product/AddProduct";
import { AdminManagementPage, UserAccountPage } from "../components/management/AccountPages";
import ReportManagement from "../components/admin/ReportManagement";

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={<HomeComp />} />
    <Route path="/login" element={<LoginComp />} />
    <Route path="/register" element={<RegisterComp />} />
    <Route path="/logout" element={<LogoutComp />} />
    <Route path="/user" element={<ProtectedRoute allowedRoles={["USER"]}><UserAccountPage /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><UserAccountPage /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/manage" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminManagementPage /></ProtectedRoute>} />
    <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["ADMIN"]}><ReportManagement /></ProtectedRoute>} />
    <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
    <Route path="/products/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
    <Route path="/products/:pid" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
    <Route path="/products/edit/:pid" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
    <Route path="*" element={<HomeComp />} />
  </Routes>;
}


