import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="" />
                    <p>Fast delivery, secure payments, real-time order tracking, and a wide variety of restaurants—all in one place. Yumzy is built to make every food order quick, convenient, and enjoyable.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>delivery</li>
                        <li>Privacy policy</li>

                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>0778410323</li>
                        <li>yumzy.com@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr />
        
        </div>
    )
}

export default Footer