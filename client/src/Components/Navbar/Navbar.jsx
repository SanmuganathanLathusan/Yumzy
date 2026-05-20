import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

const Navbar = () => {
    const [menu, setMenu] = useState("home");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const { getTotalCartAmount, searchQuery, setSearchQuery, token } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const exploreMenu = document.getElementById('explore-menu');
            const appDownload = document.getElementById('app-download');
            const footer = document.getElementById('footer');

            const scrollPos = window.scrollY + 200;

            if (window.location.pathname === '/contact') {
                setMenu("contact-us");
                return;
            }

            if (appDownload && scrollPos >= appDownload.offsetTop) {
                setMenu("mobile-app");
            } else if (exploreMenu && scrollPos >= exploreMenu.offsetTop) {
                setMenu("menu");
            } else if (window.location.pathname === '/') {
                setMenu("home");
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => setMobileOpen(false);

    const handleNavClick = (e, menuName, id) => {
        e.preventDefault();
        setMenu(menuName);
        closeMenu();
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <>
            <div className='navbar'>
                <Link to='/' onClick={() => window.scrollTo(0, 0)}><img src={assets.logo} alt="" className='logo' /></Link>
                <ul className='navbar-menu'>
                    <Link to='/' onClick={() => { setMenu("home"); window.scrollTo(0, 0) }} className={menu === "home" ? "active" : ""}>Home</Link>
                    <a href='#explore-menu' onClick={(e) => handleNavClick(e, "menu", "explore-menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
                    <a href='#app-download' onClick={(e) => handleNavClick(e, "mobile-app", "app-download")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
                    <Link to='/contact' onClick={() => { setMenu("contact-us"); window.scrollTo(0, 0); }} className={menu === "contact-us" ? "active" : ""}>Contact Us</Link>
                </ul>
                <div className="navbar-right">
                    <div className="navbar-search-container">
                        <img src={assets.search_icon} alt="Search" onClick={() => setShowSearch(!showSearch)} className="search-icon-img" />
                        <input 
                            type="text" 
                            placeholder="Search food..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={showSearch ? "show" : ""}
                        />
                    </div>
                    <div className="navbar-search-icon">
                        <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                        <div className={getTotalCartAmount() == 0 ? "" : "dot"}></div>
                    </div>
                    {token ? (
                        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                            <Link to='/dashboard' style={{color: 'white', fontWeight: 'bold', textDecoration: 'none'}}>Dashboard</Link>
                            <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Logout</button>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')}>Sign In</button>
                    )}
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
                <a href='#explore-menu' onClick={(e) => handleNavClick(e, "menu", "explore-menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
                <a href='#app-download' onClick={(e) => handleNavClick(e, "mobile-app", "app-download")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
                <Link to='/contact' onClick={() => { setMenu("contact-us"); window.scrollTo(0, 0); closeMenu(); }} className={menu === "contact-us" ? "active" : ""}>Contact Us</Link>
                {token ? (
                    <button onClick={() => { navigate('/dashboard'); closeMenu(); }}>Dashboard</button>
                ) : (
                    <button onClick={() => { navigate('/login'); closeMenu(); }}>Sign In</button>
                )}
            </div>
        </>
    )
}

export default Navbar