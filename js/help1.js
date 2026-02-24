// Main Application
class CareAyurvedaApp {
    constructor() {
        this.quantity = 1;
        this.pricePerUnit = 359;
        this.couponCode = "AYUR25";
        this.phoneNumber = "918925306239";
        this.email = "careayurveda.contact@gmail.com";
        this.init();
    }

  

} 
// Image Gallery Class
class ImageGallery {
    constructor() {
        this.images = [
            'images/product-front.png',
            'images/product-back.png',
            'images/product-side.png',
            'images/product-top.png',
            'images/care-ayurveda-fav-color.png',
            'images/care-ayurveda-fav.png',
            'images/care-ayurveda-logo.png'
        ];
        this.preloadImages();
    }

    preloadImages() {
        this.images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
}

// Cart Management
class CartManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('care_ayurveda_cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showToast(`${product.name} added to cart!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartCount();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('care_ayurveda_cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const count = this.getItemCount();
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    showToast(message) {
        const app = window.careAyurvedaApp;
        if (app) app.showToast(message);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    window.careAyurvedaApp = new CareAyurvedaApp();
    
    // Initialize image gallery
    window.imageGallery = new ImageGallery();
    
    // Initialize cart manager
    window.cartManager = new CartManager();
    
    // Add loading animation to buttons
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="loading-spinner"></span> Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 2000);
        });
    });
});

// Analytics Tracking
if (typeof gtag !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'YOUR_GA_ID'); // Replace with actual GA ID
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Error:', e.message);
    // You can send this to your error tracking service
});

// Offline detection
window.addEventListener('online', () => {
    document.querySelectorAll('.offline-message').forEach(msg => {
        msg.style.display = 'none';
    });
});

window.addEventListener('offline', () => {
    const offlineMsg = document.createElement('div');
    offlineMsg.className = 'offline-message';
    offlineMsg.innerHTML = 'You are offline. Some features may not be available.';
    offlineMsg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff6b6b;
        color: white;
        text-align: center;
        padding: 10px;
        z-index: 10000;
    `;
    document.body.appendChild(offlineMsg);
});