import React, { useEffect, useState } from 'react'; 
import { json, useNavigate } from 'react-router-dom';
import './home.css'
const Home = () => {
    const navigate = useNavigate();
    const [isLogin ,setIsLoging] = useState();
    useEffect(()=>{
      if(localStorage.getItem('token')){
        setIsLoging(true);
      }else{
        setIsLoging(false);
      }
    },[])
  return (
    <div className='container homepage d-flex justify-content-center align-items-center'>
      {
        isLogin?<button onClick={() => {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('id');
          navigate("/login");
        }}>logout</button> :<button onClick={() => navigate("/login")}>Login</button>
      }
        
        <button onClick={() => navigate("/signup")}>signup</button>
        <button onClick={() => navigate("/changeoldpassword")}>change password</button>
    </div>
  )
}

export default Home