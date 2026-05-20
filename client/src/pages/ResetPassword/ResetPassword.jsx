import React, { useState, useContext } from 'react';
import './ResetPassword.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { setToken, url } = useContext(StoreContext);
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(url + `/api/auth/resetpassword/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            const result = await response.json();

            if (result.success) {
                setToken(result.token);
                localStorage.setItem("token", result.token);
                alert("Password reset successfully! Logging you in...");
                navigate('/dashboard');
            } else {
                alert(result.error || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Error resetting password", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className='reset-password-page'>
            <div className="reset-password-container">
                <form onSubmit={onSubmitHandler}>
                    <div className="reset-password-title">
                        <h2>Reset Password</h2>
                    </div>
                    <div className="reset-password-inputs">
                        <input 
                            name='password' 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            type="password" 
                            placeholder='New Password (Min. 6 chars)' 
                            required 
                        />
                        <input 
                            name='confirmPassword' 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            value={confirmPassword} 
                            type="password" 
                            placeholder='Confirm New Password' 
                            required 
                        />
                    </div>
                    <button type='submit'>Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
