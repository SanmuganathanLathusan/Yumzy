import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home';

import Footer from './Components/Footer/Footer';
import AppDownload from './Components/AppDownload/AppDownload';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Auth from './pages/Auth/Auth';
import Contact from './pages/Contact/Contact';
import ResetPassword from './pages/ResetPassword/ResetPassword';

const App =()=> {
  const location = useLocation();
  const isDashboardPage = location.pathname === '/dashboard' || location.pathname === '/admin';

  return (
    <>
    <Navbar />
    {isDashboardPage ? (
      <Routes>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
      </Routes>
    ) : (
      <>
        <div className='app'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/order' element={<PlaceOrder/>}/>
            <Route path='/login' element={<Auth/>}/>
            <Route path='/signup' element={<Auth/>}/>
            <Route path='/contact' element={<Contact/>}/>
            <Route path='/reset-password/:token' element={<ResetPassword/>}/>
          </Routes>
          <AppDownload/>
        </div>
        <Footer/>
      </>
    )}
    </>
  );
}

export default App;