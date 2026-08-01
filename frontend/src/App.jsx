// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import LoginComp from "./components/auth/LoginComp";
// import RegisterComp from "./components/auth/RegisterComp";
// import UserDashboard from "./components/user/userDashBoard";
// import AdminDashboard from "./components/admin/AdminDashboard";
// import LogoutComp from "./components/auth/LogoutComp";
// import HomePage from "./components/home/HomePage";


// function App() {
//   return (
//     <BrowserRouter>

//       <Routes>

//         <Route
//           path="/"
//           element={<LoginComp />}
//         />

//         <Route
//           path="/login"
//           element={<LoginComp />}
//         />

//         <Route
//           path="/register"
//           element={<RegisterComp />}
//         />

//         <Route
//           path="/user"
//           element={<UserDashboard />}
//         />

//         <Route
//           path="/admin"
//           element={<AdminDashboard />}
//         />

//         <Route
//           path="/logout"
//           element={<LogoutComp />}
//         />

//         <Route path="/home" element={<HomePage />} />

//       </Routes>

//     </BrowserRouter>
//   );
// }

// export default App;

import AppRoutes from "./routes/AppRoutes";

function App() {

    return <AppRoutes />;

}

export default App;