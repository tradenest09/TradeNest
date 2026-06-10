import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom"; 

export default function LogoutComp(){
    
       const dispatch = useDispatch()
       const navigate = useNavigate()

         useEffect(()=>{        
            dispatch(logout());
            navigate("/")
         },[]);
        
}
    
      