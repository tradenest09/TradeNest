import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes(children, role){
   
   const loginstate =  useSelector(state => state.auth)

   if(!loginstate.isAuthenticated){
    return <Navigate to= "/login" />
   }

   if(loginstate.user.role !== role){
    return <Navigate to="/unauthorized" />
   }  
   return children;  
}