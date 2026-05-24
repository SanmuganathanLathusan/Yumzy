import React, { useEffect, useState, useContext } from 'react';
import './AdminDashboard.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { token } = useContext(StoreContext);
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('stats');
    const navigate = useNavigate();

    const formatUserAddress = (address) => {
        if (!address) return '—';
        const parts = [address.street, address.city, address.state, address.zipCode, address.country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : '—';
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setStats(data.data);
                } else {
                    navigate('/'); // Not authorized
                }
            } catch (error) {
                console.error("Error fetching admin stats", error);
                navigate('/');
            }
        };

        fetchStats();
    }, [token, navigate]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'users') fetchUsers();
    }, [activeTab]);

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderStatus: status })
            });
            const data = await response.json();
            if (data.success) {
                fetchOrders(); // Refresh orders
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!stats) return <div className="admin-dashboard"><h1>Loading Admin...</h1></div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Control Panel</h1>
            </div>

            <div className="admin-tabs">
                <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>Overview</button>
                <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
            </div>

            <div className="admin-content">
                {activeTab === 'stats' && (
                    <div>
                        <h2>Platform Statistics</h2>
                        <div className="stats-grid" style={{marginTop: '20px'}}>
                            <div className="stat-card">
                                <h3>Total Users</h3>
                                <p>{stats.totalUsers}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Orders</h3>
                                <p>{stats.totalOrders}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Revenue</h3>
                                <p>${stats.totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Food Items</h3>
                                <p>{stats.totalFoods}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h2>All Orders</h2>
                        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>User</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id.substring(0, 8)}</td>
                                            <td>{order.user ? order.user.name : 'Unknown'}</td>
                                            <td>${order.totalPrice.toFixed(2)}</td>
                                            <td>
                                                <select 
                                                    value={order.orderStatus} 
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="preparing">Preparing</option>
                                                    <option value="out_for_delivery">Out for Delivery</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button onClick={() => updateOrderStatus(order._id, order.orderStatus)} style={{padding: '5px 10px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Update</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div>
                        <h2>Registered Users</h2>
                        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td style={{ fontWeight: '600' }}>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone || '—'}</td>
                                            <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={formatUserAddress(user.address)}>
                                                {formatUserAddress(user.address)}
                                            </td>
                                            <td>
                                                <span className={`role-badge role-${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
