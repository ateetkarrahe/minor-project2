// Admin Dashboard JavaScript

// Check admin authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadOrders();
    updateAdminName();
});

// Check if user is admin
function checkAdminAuth() {
    const user = window.API?.getUser();
    const token = window.API?.getToken();

    if (!token || !user) {
        window.location.href = 'admin.html';
        return;
    }

    if (user.role !== 'admin') {
        // Silently redirect non-admin users to login page
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'admin.html?error=access_denied';
        return;
    }
}

// Update admin name in header
function updateAdminName() {
    const user = window.API?.getUser();
    if (user) {
        document.getElementById('adminName').textContent = `Welcome, ${user.name}`;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'admin.html';
}

// Store all orders
let allOrders = [];

// Load orders from API
async function loadOrders() {
    const container = document.getElementById('ordersContainer');
    container.innerHTML = '<div class="loading">Loading orders...</div>';

    try {
        const response = await fetch('http://localhost:5010/api/orders/admin/all', {
            headers: {
                'Authorization': `Bearer ${window.API.getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            allOrders = data.data;
            renderOrders(allOrders);
            updateStats(allOrders);
        } else {
            container.innerHTML = '<div class="empty-state"><div class="icon">❌</div><p>Failed to load orders</p></div>';
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        container.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><p>Error connecting to server</p></div>';
    }
}

// Filter orders by status
function filterOrders() {
    const statusFilter = document.getElementById('statusFilter').value;

    if (statusFilter) {
        const filtered = allOrders.filter(order => order.status === statusFilter);
        renderOrders(filtered);
    } else {
        renderOrders(allOrders);
    }
}

// Render orders table
function renderOrders(orders) {
    const container = document.getElementById('ordersContainer');

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📭</div>
                <p>No orders found</p>
            </div>
        `;
        return;
    }

    const tableHTML = `
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td class="order-id">#${order._id.slice(-6).toUpperCase()}</td>
                        <td>
                            <div class="customer-info">
                                <span class="customer-name">${order.user?.name || 'N/A'}</span>
                                <span class="customer-email">${order.user?.email || ''}</span>
                            </div>
                        </td>
                        <td class="customer-phone">
                            ${order.contactPhone ? `<a href="tel:${order.contactPhone}" style="color:#1565c0;">📞 ${order.contactPhone}</a>` : 'N/A'}
                        </td>
                        <td class="order-items">
                            ${order.items.map(item => `<span>${item.name} x${item.quantity}</span>`).join('')}
                        </td>
                        <td class="order-amount">₹${order.totalAmount}</td>
                        <td>
                            <span class="status-badge status-${order.status}">${order.status}</span>
                        </td>
                        <td>${formatDate(order.createdAt)}</td>
                        <td>
                            <select class="status-select" onchange="updateOrderStatus('${order._id}', this.value)">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                                <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                <option value="failed" ${order.status === 'failed' ? 'selected' : ''}>Failed</option>
                            </select>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`http://localhost:5010/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${window.API.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (data.success) {
            // Update local data
            const orderIndex = allOrders.findIndex(o => o._id === orderId);
            if (orderIndex > -1) {
                allOrders[orderIndex].status = newStatus;
            }

            // Re-render with current filter
            filterOrders();
            updateStats(allOrders);

            showNotification('Order status updated!', 'success');
        } else {
            showNotification('Failed to update status', 'error');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        showNotification('Error updating order', 'error');
    }
}

// Update statistics
function updateStats(orders) {
    const totalOrders = orders.length;
    const totalRevenue = orders
        .filter(o => !['cancelled', 'failed'].includes(o.status))
        .reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length;

    // Today's delivered orders
    const today = new Date().toDateString();
    const deliveredToday = orders.filter(o => {
        return o.status === 'delivered' && new Date(o.createdAt).toDateString() === today;
    }).length;

    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue}`;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('deliveredOrders').textContent = deliveredToday;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-IN', options);
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.innerHTML = `
        <span>${type === 'success' ? '✓' : '✕'}</span>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
