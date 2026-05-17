import React, {useState, useContext} from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'

const LoginPopup = ({setShowLogin}) => {
    const { setToken } = useContext(StoreContext)
    const navigate = useNavigate()
    const [currState,setCurrState]=useState("Login")
    const [data, setData] = useState({
      name: "",
      email: "",
      password: ""
    })

    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data => ({...data, [name]: value}))
    }

    const onLogin = async (event) => {
      event.preventDefault()
      
      let newUrl = "/api/auth"
      if (currState === "Login") {
        newUrl += "/login"
      } else {
        newUrl += "/register"
      }

      try {
        const response = await fetch(newUrl, {
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
          setShowLogin(false);
          navigate('/dashboard');
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error("Error during authentication", error);
        alert("An error occurred during authentication.");
      }
    }

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
          <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>  
            <div className="login-popup-inputs">
                {currState==="Login"?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required/>}
                
                 <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required/>
                  <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder=' Password' required/>
            </div>
            <button type='submit'>{currState==="Sign Up"?"Create an account":"Login"}</button>
            <div className="login-pop-condition">
                <input type="checkbox" required />
                <p>By continuing, i agree to the terms of use & privacy policy</p>
            </div>
            {currState==="Login"
            ?<p>Create a new account?<span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
            :<p>Already have an account?<span onClick={()=>setCurrState("Login")}>Login here</span></p>
          
          }

        </form>
    </div>
  )
}

export default LoginPopup