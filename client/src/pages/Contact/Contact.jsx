import React, { useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.fullName || !formData.email || !formData.message) {
            setStatus('error');
            return;
        }

        // Simulate API call for backend readiness
        setTimeout(() => {
            setStatus('success');
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setTimeout(() => setStatus(null), 5000);
        }, 800);
    };

    return (
        <div className="contact-page fade-in">
            {/* Hero Section */}
            <div className="contact-hero">
                <h1>Get in Touch</h1>
                <p>We'd love to hear from you! Whether you have a question about our food, delivery, or anything else, our team is ready to answer all your questions.</p>
            </div>

            <div className="contact-container">
                {/* Contact Form */}
                <div className="contact-form-section">
                    <h2>Send us a message</h2>
                    {status === 'success' && <div className="notification success">Your message has been sent successfully! We'll get back to you soon.</div>}
                    {status === 'error' && <div className="notification error">Please fill in all required fields.</div>}
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="input-group">
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name *" required />
                        </div>
                        <div className="form-row">
                            <div className="input-group">
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" required />
                            </div>
                            <div className="input-group">
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
                            </div>
                        </div>
                        <div className="input-group">
                            <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" />
                        </div>
                        <div className="input-group">
                            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message *" rows="5" required></textarea>
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>

                {/* Company Details */}
                <div className="contact-info-section">
                    <h2>Contact Information</h2>
                    <div className="info-cards">
                        <div className="info-card">
                            <div className="icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div>
                                <h3>Location</h3>
                                <p>123 Yumzy Street, Food City, FC 12345</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div>
                                <h3>Phone</h3>
                                <p>+1 (234) 567-8900</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div>
                                <h3>Email</h3>
                                <p>support@yumzy.com</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                            <div>
                                <h3>Working Hours</h3>
                                <p>Mon - Sun: 8:00 AM - 11:00 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="social-media">
                        <h3>Follow Us</h3>
                        <div className="social-icons">
                            <a href="#" aria-label="Facebook">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Map */}
            
        </div>
    );
};

export default Contact;
