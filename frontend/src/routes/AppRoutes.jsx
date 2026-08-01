import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginComp from "../components/auth/LoginComp";
import RegisterComp from "../components/auth/RegisterComp";
import LogoutComp from "../components/auth/LogoutComp";

// import HomeComp from "../components/home/HomeComp";

// import UserDashboard from "../components/user/UserDashboard";
// import AdminDashboard from "../components/admin/AdminDashboard";

//import ProtectedRoute from "../components/common/ProtectedRoute";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* <Route
                    path="/"
                    element={<HomeComp />}
                /> */}

                <Route
                    path="/login"
                    element={<LoginComp />}
                />

                <Route
                    path="/register"
                    element={<RegisterComp />}
                />

                <Route
                    path="/logout"
                    element={<LogoutComp />}
                />

                {/* <Route
                    path="/user"
                    element={
                        <ProtectedRoute>

                            <UserDashboard />

                        </ProtectedRoute>
                    }
                /> */}

                {/* <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>

                            <AdminDashboard />

                        </ProtectedRoute>
                    }
                /> */}

            </Routes>

        </BrowserRouter>

    );

}