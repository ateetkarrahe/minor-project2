// API Configuration
const API_BASE_URL = 'http://localhost:5010/api';

const fetchProduct = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Products loaded:', data.data?.length || 0);
        return data.data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('user');

// Check if user is logged in
const isLoggedIn = () => !!getToken();

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add authorization header if token exists
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
const authAPI = {
    register: async (userData) => {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        if (response.success) {
            setToken(response.token);
            setUser(response.user);
        }
        return response;
    },

    login: async (email, password) => {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (response.success) {
            setToken(response.token);
            setUser(response.user);
        }
        return response;
    },

    logout: () => {
        removeToken();
        removeUser();
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    },

    getProfile: () => apiRequest('/auth/me'),

    updateProfile: (data) => apiRequest('/auth/updatedetails', {
        method: 'PUT',
        body: JSON.stringify(data)
    })
};

// Menu API
const menuAPI = {
    getAll: () => apiRequest('/menu'),

    getByCategory: (category) => apiRequest(`/menu/category/${category}`),

    getById: (id) => apiRequest(`/menu/${id}`),

    search: (query) => apiRequest(`/menu/search/${query}`)
};

// Cart API
const cartAPI = {
    get: () => apiRequest('/cart'),

    add: (menuItemId, quantity = 1) => apiRequest('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ menuItemId, quantity })
    }),

    update: (menuItemId, quantity) => apiRequest('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ menuItemId, quantity })
    }),

    remove: (itemId) => apiRequest(`/cart/remove/${itemId}`, {
        method: 'DELETE'
    }),

    clear: () => apiRequest('/cart/clear', {
        method: 'DELETE'
    })
};

// Orders API
const ordersAPI = {
    create: (orderData) => apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    }),

    getAll: () => apiRequest('/orders'),

    getById: (id) => apiRequest(`/orders/${id}`),

    cancel: (id) => apiRequest(`/orders/${id}/cancel`, {
        method: 'PUT'
    })
};

// Update UI based on login state
const updateAuthUI = () => {
    const user = getUser();
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');

    if (user && loginBtn && signupBtn) {
        loginBtn.innerHTML = `<a href="orders.html">My Orders</a>`;
        signupBtn.innerHTML = `<a href="#" onclick="authAPI.logout(); return false;">Logout</a>`;
    }
};

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);

// Export for use in other scripts
window.API = {
    auth: authAPI,
    menu: menuAPI,
    cart: cartAPI,
    orders: ordersAPI,
    isLoggedIn,
    getUser,
    getToken,
    fetchProducts: fetchProduct
};
