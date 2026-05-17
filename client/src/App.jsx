import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';

import Footer from './Components/Footer/Footer';
import AppDownload from './Components/AppDownload/AppDownload';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Auth from './pages/Auth/Auth';

const App =()=> {
  return (
    <>
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={<PlaceOrder/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
        <Route path='/login' element={<Auth/>}/>
        <Route path='/signup' element={<Auth/>}/>
      </Routes>
      <AppDownload/>
      <Footer/>
    </div>
    </>
  );
}

export default App;