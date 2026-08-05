import { useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/common/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./components.css";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className="flex-grow-1">
        <AppRoutes />
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>

  );

}

export default App;