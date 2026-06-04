// Cart functionality with backend integration

// Local cart for non-logged in users
let localCart = JSON.parse(localStorage.getItem('localCart')) || [];

// Save local cart
const saveLocalCart = () => {
    localStorage.setItem('localCart', JSON.stringify(localCart));
};

// Get cart count for display
const getCartCount = () => {
    if (window.API && window.API.isLoggedIn()) {
        const cartData = JSON.parse(localStorage.getItem('cartData') || '{"items":[]}');
        return cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    return localCart.reduce((sum, item) => sum + item.quantity, 0);
};

// Update cart count in header
const updateCartBadge = () => {
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    const count = getCartCount();

    cartLinks.forEach(link => {
        // Remove existing badge
        const existingBadge = link.querySelector('.cart-badge');
        if (existingBadge) existingBadge.remove();

        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = count;
            badge.style.cssText = `
        background: #ff5722;
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 12px;
        margin-left: 5px;
      `;
            link.appendChild(badge);
        }
    });
};

// Add to cart (works for both logged in and guest users)
// Using local cart for all users since static HTML menu items don't have MongoDB ObjectIds
const addToCart = async (itemData) => {
    // Always use local cart approach - both for guests and logged-in users
    // This works because our menu items are static HTML without MongoDB IDs
    const existingIndex = localCart.findIndex(item => item.id === itemData.id);

    if (existingIndex > -1) {
        localCart[existingIndex].quantity += 1;
    } else {
        localCart.push({
            id: itemData.id,
            name: itemData.name,
            price: itemData.price,
            image: itemData.image,
            quantity: 1
        });
    }

    saveLocalCart();
    showToast('Item added to cart!', 'success');
    updateCartBadge();
};

// Show toast notification
const showToast = (message, type = 'success') => {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '✕'}</span>
    <span>${message}</span>
  `;
    toast.style.cssText = `
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

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Setup add to cart buttons on menu pages
const setupAddToCartButtons = () => {
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const card = btn.closest('.menu-card');
            if (!card) return;

            const name = card.querySelector('h3')?.textContent || 'Item';
            const priceText = card.querySelector('.price')?.textContent || '₹0';
            const price = parseInt(priceText.replace(/[₹,]/g, '')) || 0;
            const image = card.querySelector('img')?.src || '';

            // Generate a simple ID from name
            const id = name.toLowerCase().replace(/\s+/g, '-');

            addToCart({ id, name, price, image });
        });
    });
};

// Transfer local cart to backend after login
const syncCartToBackend = async () => {
    if (window.API && window.API.isLoggedIn() && localCart.length > 0) {
        try {
            // Note: Backend would need menu item IDs, this is a simplified version
            // For now, keep the local cart working for logged-in users too
            console.log('User logged in with', localCart.length, 'items in cart');
            // Don't clear the cart - let user keep their items!
        } catch (error) {
            console.error('Error syncing cart:', error);
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupAddToCartButtons();
    updateCartBadge();
    syncCartToBackend();
});

// Export
window.CartManager = {
    addToCart,
    getCartCount,
    updateCartBadge,
    showToast,
    localCart: () => localCart
};
