import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginComp(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit=(e)=>{
        e.preventDefault();
        const reqoptions ={
            method :"POST",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify({
                username: username,
                password:password
            })
        }
         fetch("http://localhost:9000/login",reqoptions)
         .then(resp =>{
            if(resp.status === 200){
                return resp.json()
            }            else if(resp.status === 404){
                setMsg("Invalid username or password");
            }
                return {}
            
         })
         .then(data =>{
            console.log(JSON.stringify(data));
            dispatch(login({user: data.user, token: data.token}))

            if(data.user.role === 1){
                //navigate to admin dashboard
                navigate("/admin")
            }
            else if(data.user.role === 2){
                //navigate to user dashboard
                navigate("/user")
            }
         })
    };
    return(
        <>
        <h1>LOGIN FORM</h1>
        <form action="">
            Enter Username: <input type="text" name="userna,e" value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
            <br />
            Enter Password: <input type="text" name="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} />


            <input type="submit" value="LOGIN" onClick={handleSubmit} />
            
        </form>
        <p>{msg}</p>
        <p>username:{username}</p>
        <p>password:{password}</p>
        </>
    )
}