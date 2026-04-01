import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const [mobileOpen, setMobileOpen] = useState(false);
    const { getTotalCartAmount } = useContext(StoreContext);

    useEffect(() => {
        const handleScroll = () => {
            const exploreMenu = document.getElementById('explore-menu');
            const appDownload = document.getElementById('app-download');
            const footer = document.getElementById('footer');

            const scrollPos = window.scrollY + 200;

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

    const closeMenu = () => setMobileOpen(false);

    return (
        <>
            <div className='navbar'>
                <Link to='/' onClick={() => window.scrollTo(0, 0)}><img src={assets.logo} alt="" className='logo' /></Link>
                <ul className='navbar-menu'>
                    <Link to='/' onClick={() => { setMenu("home"); window.scrollTo(0, 0) }} className={menu === "home" ? "active" : ""}>Home</Link>
                    <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
                    <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
                    <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
                </ul>
                <div className="navbar-right">
                    <img src={assets.search_icon} alt="" />
                    <div className="navbar-search-icon">
                        <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                        <div className={getTotalCartAmount() == 0 ? "" : "dot"}></div>
                    </div>
                    <button onClick={() => setShowLogin(true)}>Sign In</button>
                    <button className="navbar-hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* Mobile full-screen menu */}
            <div className={`navbar-mobile-menu ${mobileOpen ? "open" : ""}`}>
                <button className="navbar-mobile-close" onClick={closeMenu} aria-label="Close menu">✕</button>
                <Link to='/' onClick={() => { setMenu("home"); window.scrollTo(0, 0); closeMenu(); }} className={menu === "home" ? "active" : ""}>Home</Link>
                <a href='#explore-menu' onClick={() => { setMenu("menu"); closeMenu(); }} className={menu === "menu" ? "active" : ""}>Menu</a>
                <a href='#app-download' onClick={() => { setMenu("mobile-app"); closeMenu(); }} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
                <a href='#footer' onClick={() => { setMenu("contact-us"); closeMenu(); }} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
                <button onClick={() => { setShowLogin(true); closeMenu(); }}>Sign In</button>
            </div>
        </>
    )
}

export default Navbar