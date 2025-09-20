import React from 'react';
import { useState } from 'react';
import "../styles/Login.scss";
import { setLogin } from '../redux/state';
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password})
      });

      // Get data after fetching
      const loggedIn = await response.json();

      
      if(loggedIn){
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );

        navigate("/")
      }

    } catch (err) {
      console.log("login failed",err);
    }

  }



  return (
    <div className='login'>
       <div className="login_content">
        <form action="" className='login_content_form' onSubmit={handleSubmit}>
          <input type="email" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder='Password' value={password} onChange={((e)=>setPassword(e.target.value))} required />
          <button type="submit">LOGIN</button>
          
        </form>
        <a href="/register">Don't have an account? Sign In here</a>
       </div>
    </div>
  )
}

export default LoginPage