import React, { useState } from 'react'
import addImage from '../assets/addImage.png';
import "../styles/Register.scss";
import {useNavigate} from "react-router-dom";
import { useEffect } from 'react';




const RegisterPage = () => {
    const [formData , setFormData] = useState({
        firstName : "",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:"",
        profileImage: null

    });
    console.log(formData);
    const handlechange = (e)=>{
        const { name, value, files } = e.target;
        setFormData({
            ...formData, 
            [name] : value,
            [name] : name === "profileImage"? files[0] : value
        });
    };

    const [passwordMatch, setPasswordMatch] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "");
    });

    const handleSubmit = async(e)=>{
        e.preventDefault();


        try {
            const register_form = new FormData();

            for(let key in formData){
                register_form.append(key, formData[key]);
                
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
                method: "POST",
                body: register_form
            })

            if(response.ok){
                navigate("/login");
            }
        } catch (err) {
            console.log("Registration Failed", err.message);  
        }


    }

      return (
    <div className='register'>
        <div className="register_content">
            <form action="" className='register_content_form' onSubmit={handleSubmit}>
                <input type="text" 
                    placeholder='First Name'
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handlechange}


                />
                <input type="text" 
                    placeholder='Last Name'
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handlechange}

                />
                <input type="email" 
                    placeholder='Email'
                    name="email"
                    required
                    value={formData.email}
                    onChange={handlechange}
                    
                />
                <input type="password" 
                    placeholder='Password'
                    name="password"
                    required
                    value={formData.password}
                    onChange={handlechange}

                />
                
                
                <input type="password" 
                    placeholder='Confirm Password'
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handlechange} 
                />

                {!passwordMatch && (
                    <p style={{color: "red"}}>Passwords are not matched!</p>
                )}
                <input type="file"
                    id="image" 
                    name="profileImage"
                    accept='image/*' 
                    style={{display:"none"}}
                    required
                    value={formData.image}
                    onChange={handlechange}

                />
                <label htmlFor='image'>
                    <img src={addImage} alt="add profile photo" />
                </label>
                <p>Upload Your Photo</p>

                {formData.profileImage && (
                    <img src={URL.createObjectURL(formData.profileImage)} 
                    alt='profile photo'
                    style={{maxWidth: "80px"}}
                    />

                )}
                <button type="submit" disabled={!passwordMatch}>REGISTER</button>
            </form>
            <a href="/login">Already have an account? Log In Here</a>
        </div>
    </div>
  )
}

export default RegisterPage