import React, { useEffect, useState, useContext } from 'react';
import './DeliveryDashboard.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const DeliveryDashboard = () => {
    const { token, setToken, url } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('available'); // 'available', 'active', 'delivered'
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(url + '/api/orders/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                // Sort by date (newest first)
                const sorted = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sorted);
            } else {
                // If not authorized as delivery/admin, bounce back
                alert("Access Denied: Restricted to Delivery Riders.");
                navigate('/');
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [token, navigate]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(url + `/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderStatus: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                // Update local state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? { ...order, orderStatus: newStatus } : order
                    )
                );
                alert(`Order marked as ${newStatus === 'out_for_delivery' ? 'Out for Delivery!' : 'Delivered! ✓'}`);
            } else {
                alert(data.error || "Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating order status.");
        }
    };

    const formatAddress = (addr) => {
        if (!addr) return 'No Address Provided';
        const parts = [addr.street, addr.city, addr.state, addr.zipCode].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'No Address Provided';
    };

    // Filters
    const availableOrders = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'preparing');
    const myDeliveries = orders.filter(o => o.orderStatus === 'out_for_delivery');
    const completedOrders = orders.filter(o => o.orderStatus === 'delivered');

    const handleLogout = () => {
        setToken("");
        localStorage.removeItem("token");
        navigate('/login');
    };

    return (
        <div className="delivery-dashboard">
            <div className="delivery-header-card">
                <div className="header-info">
                    <h1>Rider Portal</h1>
                    <p className="rider-subtitle">Manage your active runs & deliveries</p>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                </button>
            </div>

            {/* Quick Stats Panel */}
            <div className="rider-stats-grid">
                <div className="rider-stat-box box-orange">
                    <h4>{availableOrders.length}</h4>
                    <p>Ready for Pickup</p>
                </div>
                <div className="rider-stat-box box-blue">
                    <h4>{myDeliveries.length}</h4>
                    <p>On My Run</p>
                </div>
                <div className="rider-stat-box box-green">
                    <h4>{completedOrders.length}</h4>
                    <p>Delivered Today</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="delivery-tabs">
                <button className={activeTab === 'available' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('available')}>
                    📦 Available ({availableOrders.length})
                </button>
                <button className={activeTab === 'active' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('active')}>
                    🏍️ Active Run ({myDeliveries.length})
                </button>
                <button className={activeTab === 'delivered' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('delivered')}>
                    ✅ Completed ({completedOrders.length})
                </button>
            </div>

            {/* Main Content Area */}
            <div className="delivery-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="rider-spinner"></div>
                        <p>Fetching your runs...</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {activeTab === 'available' && (
                            availableOrders.length === 0 ? (
                                <div className="empty-state">
                                    <span className="empty-emoji">🍕</span>
                                    <p>No new orders ready for pickup right now.</p>
                                    <button className="refresh-btn" onClick={fetchOrders}>Check Again</button>
                                </div>
                            ) : (
                                availableOrders.map(order => (
                                    <div key={order._id} className="delivery-order-card">
                                        <div className="card-top">
                                            <span className="order-id">#{order._id.substring(0, 8)}</span>
                                            <span className={`status-pill status-${order.orderStatus}`}>{order.orderStatus}</span>
                                        </div>
                                        <div className="card-body">
                                            <div className="info-row">
                                                <strong>Customer:</strong>
                                                <span>{order.user ? order.user.name : 'Guest'}</span>
                                            </div>
                                            <div className="info-row">
                                                <strong>Phone:</strong>
                                                <span>{order.user?.phone || 'Not provided'}</span>
                                            </div>
                                            <div className="info-row">
                                                <strong>Address:</strong>
                                                <span className="delivery-address">{formatAddress(order.deliveryAddress)}</span>
                                            </div>
                                            <div className="info-row font-medium">
                                                <strong>Total Price:</strong>
                                                <span className="order-price">${order.totalPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="info-row font-medium">
                                                <strong>Method:</strong>
                                                <span className="payment-tag">{order.paymentMethod}</span>
                                            </div>
                                            <div className="order-items-summary">
                                                <strong>Items:</strong> {order.items.map(i => `${i.food} (x${i.quantity})`).join(', ')}
                                            </div>
                                        </div>
                                        <button className="action-btn pickup-btn" onClick={() => updateStatus(order._id, 'out_for_delivery')}>
                                            🏍️ Pick up Order & Start Run
                                        </button>
                                    </div>
                                ))
                            )
                        )}

                        {activeTab === 'active' && (
                            myDeliveries.length === 0 ? (
                                <div className="empty-state">
                                    <span className="empty-emoji">🏍️</span>
                                    <p>Your delivery run is currently empty.</p>
                                    <p className="subtext">Go to the "Available" tab to pick up new food deliveries!</p>
                                </div>
                            ) : (
                                myDeliveries.map(order => (
                                    <div key={order._id} className="delivery-order-card active-card">
                                        <div className="card-top">
                                            <span className="order-id">#{order._id.substring(0, 8)}</span>
                                            <span className="status-pill status-transit">Out for Delivery</span>
                                        </div>
                                        <div className="card-body">
                                            <div className="info-row">
                                                <strong>Customer:</strong>
                                                <span>{order.user ? order.user.name : 'Guest'}</span>
                                            </div>
                                            <div className="info-row">
                                                <strong>Phone:</strong>
                                                <span><a href={`tel:${order.user?.phone}`} className="phone-link">📞 {order.user?.phone || 'Not provided'}</a></span>
                                            </div>
                                            <div className="info-row">
                                                <strong>Address:</strong>
                                                <span className="delivery-address highlight-address">{formatAddress(order.deliveryAddress)}</span>
                                            </div>
                                            <div className="info-row font-medium">
                                                <strong>Price:</strong>
                                                <span className="order-price">${order.totalPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="info-row font-medium">
                                                <strong>Payment Method:</strong>
                                                <span className="payment-tag active-tag">{order.paymentMethod}</span>
                                            </div>
                                            <div className="order-items-summary">
                                                <strong>Items:</strong> {order.items.map(i => `${i.food} (x${i.quantity})`).join(', ')}
                                            </div>
                                        </div>
                                        <button className="action-btn deliver-btn" onClick={() => updateStatus(order._id, 'delivered')}>
                                            ✓ Click to Mark Order as Delivered
                                        </button>
                                    </div>
                                ))
                            )
                        )}

                        {activeTab === 'delivered' && (
                            completedOrders.length === 0 ? (
                                <div className="empty-state">
                                    <span className="empty-emoji">🏆</span>
                                    <p>No orders completed today yet.</p>
                                </div>
                            ) : (
                                completedOrders.map(order => (
                                    <div key={order._id} className="delivery-order-card completed-card">
                                        <div className="card-top">
                                            <span className="order-id">#{order._id.substring(0, 8)}</span>
                                            <span className="status-pill status-delivered">✓ Delivered</span>
                                        </div>
                                        <div className="card-body">
                                            <div className="info-row">
                                                <strong>Customer:</strong>
                                                <span>{order.user ? order.user.name : 'Guest'}</span>
                                            </div>
                                            <div className="info-row">
                                                <strong>Address:</strong>
                                                <span>{formatAddress(order.deliveryAddress)}</span>
                                            </div>
                                            <div className="info-row">
                                                <strong>Delivered On:</strong>
                                                <span>{new Date(order.updatedAt).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="info-row font-medium">
                                                <strong>Price:</strong>
                                                <span>${order.totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryDashboard;
