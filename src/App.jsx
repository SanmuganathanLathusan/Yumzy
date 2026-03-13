import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';

import Footer from './Components/Footer/Footer';
import AppDownload from './Components/Appdownload/AppDownload';
import LoginPopup from './Components/LoginPopup/LoginPopup';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';





const App =()=> {
  const [showLogin,setShowLogin] =useState(false)
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar  setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
                <Route path='/order' element={<PlaceOrder/>}/>
        
       
      </Routes>
       <AppDownload/>
      <Footer/>
      
     
    </div>
    </>
  );
}

export default App;