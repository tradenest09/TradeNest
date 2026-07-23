import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginComp from "./components/LoginComp";
import RegisterComp from "./components/RegisterComp";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import LogoutComp from "./components/LogoutComp";
import HomePage from "./components/HomePage";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginComp />}
        />

        <Route
          path="/login"
          element={<LoginComp />}
        />

        <Route
          path="/register"
          element={<RegisterComp />}
        />

        <Route
          path="/user"
          element={<UserDashboard />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/logout"
          element={<LogoutComp />}
        />

        <Route path="/home" element={<HomePage />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;