import React, { useEffect, useState, useContext } from 'react';
import './Dashboard.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const { token, setToken } = useContext(StoreContext);
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setUser(data.data);
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
                const response = await fetch('/api/orders', {
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
    }, [token, navigate, setToken]);

    if (!user) return <div className="dashboard"><div className="dashboard-header"><h1>Loading...</h1></div></div>;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>My Dashboard</h1>
                <p>Welcome back, {user.name}!</p>
            </div>
            
            <div className="dashboard-content">
                <div className="dashboard-card user-info">
                    <h2>Account Information</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    {user.role === 'admin' && (
                        <Link to="/admin" className="admin-link-btn">Go to Admin Dashboard</Link>
                    )}
                </div>

                <div className="dashboard-card order-history">
                    <h2>Order History</h2>
                    {orders.length === 0 ? (
                        <p>You haven't placed any orders yet.</p>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id.substring(0, 8)}...</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>{order.items.length} items</td>
                                            <td>${order.totalPrice.toFixed(2)}</td>
                                            <td>
                                                <span className={`order-status status-${order.orderStatus}`}>
                                                    {order.orderStatus.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
