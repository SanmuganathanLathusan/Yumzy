import React, { useState, useContext, useEffect } from 'react';
import './Auth.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Auth = () => {
    const { token, setToken, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if the route is /login or /signup
    const isSignupRoute = location.pathname.includes('signup');
    const [currState, setCurrState] = useState(isSignupRoute ? "Sign Up" : "Login");
    
    const [data, setData] = useState({
      name: "",
      email: "",
      password: ""
    });

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data => ({...data, [name]: value}));
    };

    const onSubmitHandler = async (event) => {
      event.preventDefault();
      
      let newUrl = "/api/auth";
      if (currState === "Login") {
        newUrl += "/login";
      } else {
        newUrl += "/register";
      }

      try {
        const response = await fetch(url + newUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();

        if (result.success) {
          setToken(result.token);
          localStorage.setItem("token", result.token);
          navigate('/dashboard');
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error("Error during authentication", error);
        alert("An error occurred during authentication.");
      }
    };

  return (
    <div className='auth-page'>
        <div className="auth-container">
            <form onSubmit={onSubmitHandler}>
                <div className="auth-title">
                    <h2>{currState}</h2>
                </div>  
                <div className="auth-inputs">
                    {currState === "Sign Up" && (
                        <input 
                            name='name' 
                            onChange={onChangeHandler} 
                            value={data.name} 
                            type="text" 
                            placeholder='Your Full Name' 
                            required 
                        />
                    )}
                    <input 
                        name='email' 
                        onChange={onChangeHandler} 
                        value={data.email} 
                        type="email" 
                        placeholder='Email Address' 
                        required 
                    />
                    <input 
                        name='password' 
                        onChange={onChangeHandler} 
                        value={data.password} 
                        type="password" 
                        placeholder='Password (Min. 6 chars)' 
                        required 
                    />
                </div>
                <button type='submit'>{currState === "Sign Up" ? "Create Account" : "Login"}</button>
                
                {currState === "Sign Up" && (
                    <div className="auth-condition">
                        <input type="checkbox" required />
                        <p>By continuing, I agree to the terms of use & privacy policy.</p>
                    </div>
                )}
                
                {currState === "Login" ? (
                    <p className="auth-toggle">Don't have an account? <span onClick={() => {setCurrState("Sign Up"); navigate('/signup')}}>Sign up here</span></p>
                ) : (
                    <p className="auth-toggle">Already have an account? <span onClick={() => {setCurrState("Login"); navigate('/login')}}>Login here</span></p>
                )}
            </form>
        </div>
    </div>
  );
};

export default Auth;
