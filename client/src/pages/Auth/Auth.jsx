import React, { useState, useContext, useEffect } from 'react';
import './Auth.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate, useLocation } from 'react-router-dom';
import deliveryBikeImg from '../../assets/delivery_bike.png';
import customerImg from '../../assets/customer_auth.png';
import adminImg from '../../assets/admin_auth.png';

const Auth = () => {
    const { token, setToken, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if the route is /login or /signup
    const isSignupRoute = location.pathname.includes('signup');
    const [currState, setCurrState] = useState(isSignupRoute ? "Sign Up" : "Login");
    const [selectedRole, setSelectedRole] = useState("customer"); // 'customer', 'delivery', 'admin'
    
    const getAuthImage = () => {
        if (currState === "Sign Up" || currState === "Forgot Password") {
            return customerImg;
        }
        if (selectedRole === "admin") return adminImg;
        if (selectedRole === "delivery") return deliveryBikeImg;
        return customerImg;
    };

    const getAuthGradient = () => {
        if (currState === "Sign Up" || currState === "Forgot Password") {
            return "gradient-customer";
        }
        if (selectedRole === "admin") return "gradient-admin";
        if (selectedRole === "delivery") return "gradient-delivery";
        return "gradient-customer";
    };

    const [data, setData] = useState({
      name: "",
      email: "",
      password: ""
    });

    useEffect(() => {
        if (token) {
            // Fetch profile to see actual role and redirect accordingly
            const fetchRoleAndRedirect = async () => {
                try {
                    const response = await fetch(url + '/api/auth/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (data.success) {
                        const userRole = data.data?.role || 'customer';
                        if (userRole === 'admin') navigate('/admin');
                        else if (userRole === 'delivery') navigate('/delivery');
                        else navigate('/dashboard');
                    } else {
                        setToken("");
                        localStorage.removeItem("token");
                    }
                } catch (e) {
                    console.error("Error fetching user role:", e);
                }
            };
            fetchRoleAndRedirect();
        }
    }, [token, navigate, url, setToken]);

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
      } else if (currState === "Sign Up") {
        newUrl += "/register";
      } else {
        newUrl += "/forgotpassword";
      }

      // Customer only can signup, so force role: 'customer' at registration
      const requestPayload = currState === "Forgot Password" 
        ? { email: data.email } 
        : currState === "Sign Up" 
          ? { ...data, role: 'customer' } 
          : data;

      try {
        const response = await fetch(url + newUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestPayload)
        });
        
        const result = await response.json();

        if (result.success) {
          if (currState === "Forgot Password") {
            if (result.resetUrl) {
              const confirmGo = window.confirm("Reset link generated successfully! (Dev Mode)\n\nClick OK to go to the Reset Password page now.");
              if (confirmGo) {
                const resetToken = result.resetUrl.split('/').pop();
                navigate(`/reset-password/${resetToken}`);
              }
            } else {
              alert("A password reset link has been sent to your email address (logged in server console!).");
              setCurrState("Login");
              navigate('/login');
            }
          } else {
            // Check if actual role matches the selected role at login
            const actualRole = result.user?.role || 'customer';
            if (currState === "Login" && actualRole !== selectedRole) {
              alert(`Login Failed: This account is registered as a "${actualRole.toUpperCase()}", not as a "${selectedRole.toUpperCase()}". Please select the correct login role.`);
              return;
            }

            setToken(result.token);
            localStorage.setItem("token", result.token);
            
            if (actualRole === 'admin') {
              navigate('/admin');
            } else if (actualRole === 'delivery') {
              navigate('/delivery');
            } else {
              navigate('/dashboard');
            }
          }
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error("Error during authentication", error);
        alert(`Authentication Failed: ${error.message}\n\nPlease check:\n1. Your local backend is running (if using localhost)\n2. The server URL in client/.env is correct\n3. The backend database is successfully connected`);
      }
    };

  return (
    <div className='auth-page'>
        <div className="auth-container">
            <div className="auth-form-side">
                <form onSubmit={onSubmitHandler}>
                    <div className="auth-title">
                        <h2>{currState}</h2>
                    </div>  
                    {currState === "Login" && (
                        <div className="role-selector-container">
                            <span className="role-selector-label">Login As:</span>
                            <div className="role-tabs">
                                <button 
                                    type="button" 
                                    className={`role-tab-btn ${selectedRole === 'customer' ? 'active' : ''}`}
                                    onClick={() => setSelectedRole('customer')}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="role-icon">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    Customer
                                </button>
                                <button 
                                    type="button" 
                                    className={`role-tab-btn ${selectedRole === 'delivery' ? 'active' : ''}`}
                                    onClick={() => setSelectedRole('delivery')}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="role-icon">
                                        <circle cx="7" cy="17" r="2" />
                                        <circle cx="17" cy="17" r="2" />
                                        <path d="M10 9h5l2 3h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1M6 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1M9 17h6" />
                                        <path d="M12 6V3H9" />
                                    </svg>
                                    Rider
                                </button>
                                <button 
                                    type="button" 
                                    className={`role-tab-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                                    onClick={() => setSelectedRole('admin')}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="role-icon">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                    </svg>
                                    Admin
                                </button>
                            </div>
                        </div>
                    )}
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
                        {currState !== "Forgot Password" && (
                            <input 
                                name='password' 
                                onChange={onChangeHandler} 
                                value={data.password} 
                                type="password" 
                                placeholder='Password (Min. 6 chars)' 
                                required 
                            />
                        )}
                    </div>
                    <button type='submit'>
                        {currState === "Sign Up" ? "Create Account" : currState === "Login" ? "Login" : "Send Reset Link"}
                    </button>
                    
                    {currState === "Sign Up" && (
                        <div className="auth-condition">
                            <input type="checkbox" required />
                            <p>By continuing, I agree to the terms of use & privacy policy.</p>
                        </div>
                    )}
                    
                    {currState === "Login" && (
                        <>
                            {selectedRole === 'customer' && (
                                <p className="auth-toggle">Don't have an account? <span onClick={() => {setCurrState("Sign Up"); navigate('/signup')}}>Sign up here</span></p>
                            )}
                            <p className="auth-toggle">Forgot Password? <span onClick={() => setCurrState("Forgot Password")}>Reset it here</span></p>
                        </>
                    )}
                    
                    {currState === "Sign Up" && (
                        <p className="auth-toggle">Already have an account? <span onClick={() => {setCurrState("Login"); navigate('/login')}}>Login here</span></p>
                    )}

                    {currState === "Forgot Password" && (
                        <p className="auth-toggle">Remembered your password? <span onClick={() => {setCurrState("Login"); navigate('/login')}}>Login here</span></p>
                    )}
                </form>
            </div>
            <div className={`auth-image-side ${getAuthGradient()}`}>
                <div className="auth-image-label">
                    {selectedRole === 'admin' && currState === 'Login' && (
                        <span className="auth-role-badge badge-admin">Admin Portal</span>
                    )}
                    {selectedRole === 'delivery' && currState === 'Login' && (
                        <span className="auth-role-badge badge-delivery">Rider Portal</span>
                    )}
                    {(selectedRole === 'customer' || currState !== 'Login') && (
                        <span className="auth-role-badge badge-customer">
                            {currState === 'Sign Up' ? 'Join Yumzy' : currState === 'Forgot Password' ? 'Reset Password' : 'Welcome Back'}
                        </span>
                    )}
                </div>
                <img src={getAuthImage()} alt="Role Illustration" className="auth-role-img" />
            </div>
        </div>
    </div>
  );
};

export default Auth;
