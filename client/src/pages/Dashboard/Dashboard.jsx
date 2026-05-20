import React, { useEffect, useState, useContext, useRef } from 'react';
import './Dashboard.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import profile_icon from '../../assets/profile_icon.svg';

const Dashboard = () => {
    const { token, setToken, url } = useContext(StoreContext);
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(url + '/api/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setUser(data.data);
                    setNewName(data.data.name);
                } else {
                    setToken("");
                    localStorage.removeItem("token");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await fetch(url + '/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setOrders(data.data);
                }
            } catch (error) {
                console.error("Error fetching orders", error);
            }
        };

        fetchProfile();
        fetchOrders();
    }, [token, navigate, setToken, url]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        try {
            const response = await fetch(url + `/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order._id === orderId ? { ...order, orderStatus: 'cancelled' } : order
                    )
                );
                alert("Order cancelled successfully.");
            } else {
                alert(data.error || "Failed to cancel the order.");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleNameUpdate = async () => {
        if (!newName.trim() || newName.trim() === user.name) {
            setEditingName(false);
            setNewName(user.name);
            return;
        }

        try {
            const response = await fetch(url + '/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName.trim() })
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.data);
                setEditingName(false);
            } else {
                alert(data.error || "Failed to update name.");
            }
        } catch (error) {
            console.error("Error updating name:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('profilePic', file);

        try {
            const response = await fetch(url + '/api/auth/profile/picture', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.data);
            } else {
                alert(data.error || "Failed to upload picture.");
            }
        } catch (error) {
            console.error("Error uploading picture:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const getProfilePicUrl = () => {
        if (user?.profilePic) {
            return url + user.profilePic;
        }
        return null;
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    if (!user) return (
        <div className="dashboard">
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="dashboard">
            {/* Profile Card */}
            <div className="profile-card">
                <div className="profile-pic-wrapper" onClick={() => fileInputRef.current?.click()}>
                    {getProfilePicUrl() ? (
                        <img src={getProfilePicUrl()} alt="Profile" className="profile-pic" />
                    ) : (
                        <div className="profile-pic-placeholder">
                            {getInitials(user.name)}
                        </div>
                    )}
                    <div className="profile-pic-overlay">
                        <span>{uploading ? '⏳' : '📷'}</span>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePicUpload}
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                    />
                </div>

                <div className="profile-info">
                    <div className="profile-name-row">
                        {editingName ? (
                            <div className="name-edit-group">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="name-edit-input"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
                                />
                                <button className="name-save-btn" onClick={handleNameUpdate}>Save</button>
                                <button className="name-cancel-btn" onClick={() => { setEditingName(false); setNewName(user.name); }}>✕</button>
                            </div>
                        ) : (
                            <>
                                <h1 className="profile-name">{user.name}</h1>
                                <button className="name-edit-trigger" onClick={() => setEditingName(true)}>✏️</button>
                            </>
                        )}
                    </div>
                    <p className="profile-email">{user.email}</p>
                    <div className="profile-badges">
                        <span className={`profile-badge badge-${user.role}`}>{user.role}</span>
                        <span className="profile-badge badge-orders">{orders.length} orders</span>
                    </div>
                </div>

                {user.role === 'admin' && (
                    <Link to="/admin" className="admin-link-btn">⚙️ Admin Panel</Link>
                )}
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <div>
                        <h3>{orders.length}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">✅</span>
                    <div>
                        <h3>{orders.filter(o => o.orderStatus === 'delivered').length}</h3>
                        <p>Delivered</p>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">⏳</span>
                    <div>
                        <h3>{orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'preparing').length}</h3>
                        <p>In Progress</p>
                    </div>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">💰</span>
                    <div>
                        <h3>${orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toFixed(2)}</h3>
                        <p>Total Spent</p>
                    </div>
                </div>
            </div>

            {/* Order History */}
            <div className="dashboard-card order-history">
                <h2>📋 Order History</h2>
                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <span className="empty-icon">🍽️</span>
                        <p>You haven't placed any orders yet.</p>
                        <Link to="/" className="browse-menu-btn">Browse Menu</Link>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="order-id-cell">#{order._id.substring(0, 8)}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{order.items.length} items</td>
                                        <td className="order-price">${order.totalPrice.toFixed(2)}</td>
                                        <td>
                                            <span className={`order-status status-${order.orderStatus}`}>
                                                {order.orderStatus.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            {order.orderStatus === 'pending' ? (
                                                <button 
                                                    className="cancel-order-btn"
                                                    onClick={() => handleCancelOrder(order._id)}
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <span className="no-actions">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
