import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount } = useContext(StoreContext);

    useEffect(() => {
        const handleScroll = () => {
            const exploreMenu = document.getElementById('explore-menu');
            const appDownload = document.getElementById('app-download');
            const footer = document.getElementById('footer');

            const scrollPos = window.scrollY + 200; 

            // Check if at bottom of page
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
                setMenu("contact-us");
                return;
            }

            if (footer && scrollPos >= footer.offsetTop) {
                setMenu("contact-us");
            } else if (appDownload && scrollPos >= appDownload.offsetTop) {
                setMenu("mobile-app");
            } else if (exploreMenu && scrollPos >= exploreMenu.offsetTop) {
                setMenu("menu");
            } else {
                setMenu("home");
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className='navbar'>
            <Link to='/' onClick={() => window.scrollTo(0, 0)}><img src={assets.logo} alt="" className='logo' /></Link>
            <ul className='navbar-menu'>
                <Link to='/' onClick={() => { setMenu("home"); window.scrollTo(0, 0) }} className={menu === "home" ? "active" : ""}>Home</Link >
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a  >
                <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a  >
                <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a >
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="" />
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                    <div className={getTotalCartAmount() == 0 ? "" : "dot"}></div>
                </div>
                <button onClick={() => setShowLogin(true)}>sign in</button>
            </div>
        </div>
    )
}

export default Navbar