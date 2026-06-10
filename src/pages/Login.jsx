// import { useState } from "react";

// function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log("Login Data:", formData);

//     // API call here
//     // axios.post("/api/login", formData)
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-5">
//           <div className="card shadow">
//             <div className="card-body">
//               <h2 className="text-center mb-4">Login</h2>

//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     className="form-control"
//                     placeholder="Enter email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     className="form-control"
//                     placeholder="Enter password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="btn btn-primary w-100"
//                 >
//                   Login
//                 </button>
//               </form>

//               <p className="text-center mt-3">
//                 Don't have an account?{" "}
//                 <a href="/register">Register</a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;