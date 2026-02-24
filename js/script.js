// Initialize Swiper Carousel
let benefitsSwiper;
try {
    benefitsSwiper = new Swiper('.benefits-carousel', {
        direction: 'horizontal',
        loop: true,
        speed: 600,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });
} catch (error) {
    console.log('Swiper initialization error:', error);
}

// 3D Product Viewer Class
class Product3DViewer {
    constructor() {
        this.scale = 1;
        this.posX = 0;
        this.posY = 0;
        this.startX = 0;
        this.startY = 0;
        this.dragging = false;
        this.img = document.getElementById("mainImage");
        this.zoomText = document.getElementById("zoomPercent");
        
        if (!this.img) return;
        
        this.init();
    }
    
    init() {
        this.updateTransform();
        this.setupEventListeners();
    }
    
    updateTransform() {
        if (!this.img) return;
        this.img.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${this.scale})`;
        if (this.zoomText) {
            this.zoomText.innerText = Math.round(this.scale * 100) + "%";
        }
    }
    
    setupEventListeners() {
        // Zoom buttons
        const zoomIn = document.getElementById("zoomIn");
        const zoomOut = document.getElementById("zoomOut");
        
        if (zoomIn) {
            zoomIn.addEventListener("click", () => {
                this.scale = Math.min(this.scale + 0.1, 3);
                this.updateTransform();
            });
        }
        
        if (zoomOut) {
            zoomOut.addEventListener("click", () => {
                this.scale = Math.max(this.scale - 0.1, 1);
                if (this.scale === 1) {
                    this.posX = 0;
                    this.posY = 0;
                }
                this.updateTransform();
            });
        }
        
        // Mouse wheel zoom
        if (this.img) {
            this.img.addEventListener("wheel", (e) => {
                e.preventDefault();
                this.scale += e.deltaY < 0 ? 0.1 : -0.1;
                this.scale = Math.min(Math.max(this.scale, 1), 3);
                this.updateTransform();
            });
            
            // Drag functionality
            this.img.addEventListener("mousedown", (e) => {
                this.dragging = true;
                this.startX = e.clientX - this.posX;
                this.startY = e.clientY - this.posY;
            });
            
            // Touch support
            this.img.addEventListener("touchstart", (e) => {
                this.dragging = true;
                this.startX = e.touches[0].clientX - this.posX;
                this.startY = e.touches[0].clientY - this.posY;
            });
            
            this.img.addEventListener("touchmove", (e) => {
                if (!this.dragging || this.scale === 1) return;
                e.preventDefault();
                this.posX = e.touches[0].clientX - this.startX;
                this.posY = e.touches[0].clientY - this.startY;
                this.updateTransform();
            });
            
            this.img.addEventListener("touchend", () => {
                this.dragging = false;
            });
        }
        
        // Mouse move and up events on document
        document.addEventListener("mousemove", (e) => {
            if (!this.dragging || this.scale === 1) return;
            this.posX = e.clientX - this.startX;
            this.posY = e.clientY - this.startY;
            this.updateTransform();
        });
        
        document.addEventListener("mouseup", () => {
            this.dragging = false;
        });
    }
    
    changeImage(el) {
        if (!this.img || !el) return;
        this.img.src = el.src;
        this.scale = 1;
        this.posX = 0;
        this.posY = 0;
        this.updateTransform();
    }
}

// Make changeImage function globally available
window.changeImage = function(el) {
    if (window.productViewer) {
        window.productViewer.changeImage(el);
    } else {
        // Fallback
        const img = document.getElementById("mainImage");
        if (img) {
            img.src = el.src;
        }
    }
};

// Order Management Class
class OrderManager {
    constructor() {
        this.price = 499;
        this.quantity = 1;
        this.phoneNumber = "918925306239"; // Your WhatsApp number
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTotalPrice();
    }

    setupEventListeners() {
        // Quantity controls
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');
        const quantityInput = document.getElementById('quantity');

        if (minusBtn && plusBtn && quantityInput) {
            minusBtn.addEventListener('click', () => {
                if (this.quantity > 1) {
                    this.quantity--;
                    quantityInput.value = this.quantity;
                    this.updateTotalPrice();
                }
            });

            plusBtn.addEventListener('click', () => {
                if (this.quantity < 10) {
                    this.quantity++;
                    quantityInput.value = this.quantity;
                    this.updateTotalPrice();
                }
            });
        }

        // WhatsApp order buttons
        this.setupWhatsAppButtons();
        
        // Call buttons
        this.setupCallButtons();
        
        // Email button
        this.setupEmailButton();
    }

    setupWhatsAppButtons() {
        const whatsappButtons = [
            { selector: '#whatsappOrder', isSubmit: false },
            { selector: '#ctaWhatsApp', isSubmit: false },
            { selector: '.whatsapp-contact-btn', isSubmit: false },
            { selector: '.btn-submit', isSubmit: true }
        ];

        whatsappButtons.forEach(item => {
            const btn = document.querySelector(item.selector);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    if (item.isSubmit) {
                        e.preventDefault();
                        this.validateAndSubmitForm();
                    } else {
                        this.openWhatsAppOrder();
                    }
                });
            }
        });

        // Also add click handler for WhatsApp float button
        const whatsappFloat = document.querySelector('.whatsapp-float');
        if (whatsappFloat) {
            whatsappFloat.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWhatsAppOrder();
            });
        }
    }

    setupCallButtons() {
        const callButtons = [
            '#callNow',
            '#ctaCall',
            '.call-contact-btn',
            '.call-float'
        ];

        callButtons.forEach(selector => {
            const btn = document.querySelector(selector);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.makePhoneCall();
                });
            }
        });
    }

    setupEmailButton() {
        const emailBtn = document.querySelector('.email-contact-btn');
        if (emailBtn) {
            emailBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendEmail();
            });
        }
    }

    updateTotalPrice() {
        const total = this.price * this.quantity;
        const totalElement = document.getElementById('totalPrice');
        if (totalElement) {
            totalElement.textContent = total;
        }
    }

    validateAndSubmitForm() {
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const address = document.getElementById('address');
        let isValid = true;

        // Reset errors
        [name, phone, address].forEach(input => {
            if (input) input.style.borderColor = '';
        });

        // Validate name
        if (!name || !name.value.trim()) {
            if (name) name.style.borderColor = '#ff6b6b';
            isValid = false;
        }

        // Validate phone
        if (!phone || !phone.value.trim() || phone.value.replace(/\D/g, '').length < 10) {
            if (phone) phone.style.borderColor = '#ff6b6b';
            isValid = false;
        }

        // Validate address
        if (!address || !address.value.trim()) {
            if (address) address.style.borderColor = '#ff6b6b';
            isValid = false;
        }

        if (isValid) {
            this.openWhatsAppOrder();
        } else {
            this.showToast('Please fill all required fields correctly!');
        }
    }

    openWhatsAppOrder() {
        const name = document.getElementById('name')?.value || "Customer";
        const phone = document.getElementById('phone')?.value || "";
        const address = document.getElementById('address')?.value || "Address will be provided";

        // Get quantity from input if available
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            this.quantity = parseInt(quantityInput.value) || 1;
        }

        const message = `*New Order - Care Ayurveda Hair Oil*%0A%0A` +
            `*Customer Details:*%0A` +
            `Name: ${name}%0A` +
            `Phone: ${phone}%0A` +
            `Address: ${address}%0A%0A` +
            `*Order Details:*%0A` +
            `Product: Care Ayurveda Homemade Herbal Hair Growth Oil%0A` +
            `Quantity: ${this.quantity}%0A` +
            `Price: ₹${this.price} each%0A` +
            `Total: ₹${this.price * this.quantity}%0A%0A` +
            `*Additional Notes:*%0A` +
            `I would like to place an order. Please confirm availability and delivery time.`;

        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');

        this.showToast('Opening WhatsApp for order placement...');
    }

    makePhoneCall() {
        window.location.href = `tel:+${this.phoneNumber}`;
    }

    sendEmail() {
        const subject = 'Care Ayurveda Hair Oil Inquiry';
        const body = `Hello,%0A%0AI am interested in Care Ayurveda Hair Oil. Please contact me with more information.%0A%0AThank you.`;
        window.location.href = `mailto:careayurveda.contact@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    showToast(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Add styles dynamically
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-green, #2ecc71);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            font-family: 'Poppins', sans-serif;
        `;

        // Add keyframes if not already present
        if (!document.getElementById('toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }
}

// Mobile Navigation
function setupMobileNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const navbar = document.querySelector('.navbar');

    if (!mobileMenuBtn || !mobileNav) return;

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileNav.classList.toggle('active');
        
        // Update icon
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        }
        
        // Toggle body scroll
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-menu') && 
            !e.target.closest('.mobile-nav') && 
            mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });

    // Close on link click
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        });
    });

    // Close on resize if desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });
}

// Smooth scrolling for navigation
function setupSmoothScrolling() {
    document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav a[href^="#"], .footer-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            
            const targetSection = document.querySelector(href);
            if (!targetSection) return;
            
            const offsetTop = targetSection.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

// Navbar scroll effect
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navbar.style.background = '#ffffff';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Form validation for order form
function setupFormValidation() {
    const orderForm = document.getElementById('orderForm');
    
    if (!orderForm) return;
    
    // Add real-time validation
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            this.style.borderColor = this.value.trim() ? '' : '#ff6b6b';
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            const isValid = this.value.replace(/\D/g, '').length >= 10;
            this.style.borderColor = isValid ? '' : '#ff6b6b';
            
            // Auto-format phone number (optional)
            let numbers = this.value.replace(/\D/g, '');
            if (numbers.length > 0) {
                if (numbers.length <= 5) {
                    this.value = numbers;
                } else if (numbers.length <= 10) {
                    this.value = numbers.slice(0, 5) + ' ' + numbers.slice(5);
                } else {
                    this.value = numbers.slice(0, 5) + ' ' + numbers.slice(5, 10);
                }
            }
        });
    }
    
    if (addressInput) {
        addressInput.addEventListener('input', function() {
            this.style.borderColor = this.value.trim() ? '' : '#ff6b6b';
        });
    }
}

// Active navigation highlighting
function setupActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!sections.length || !navLinks.length) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// Product image gallery
function setupProductGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-row img');
    const mainImage = document.getElementById('mainImage');
    
    if (!thumbnails.length || !mainImage) return;
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Change main image
            mainImage.src = this.src;
            
            // Reset zoom if using product viewer
            if (window.productViewer) {
                window.productViewer.scale = 1;
                window.productViewer.posX = 0;
                window.productViewer.posY = 0;
                window.productViewer.updateTransform();
            }
        });
    });
    
    // Set first thumbnail as active
    if (thumbnails[0]) {
        thumbnails[0].classList.add('active');
    }
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    // Initialize Product 3D Viewer
    window.productViewer = new Product3DViewer();
    
    // Initialize Order Manager
    window.orderManager = new OrderManager();
    
    // Setup navigation and UI
    setupMobileNavigation();
    setupSmoothScrolling();
    setupNavbarScroll();
    setupFormValidation();
    setupActiveNavHighlight();
    setupProductGallery();
    
    // Add CSS for active nav links if not present
    if (!document.getElementById('nav-active-styles')) {
        const style = document.createElement('style');
        style.id = 'nav-active-styles';
        style.textContent = `
            .nav-links a.active {
                color: var(--primary-green, #2ecc71) !important;
                font-weight: 600;
            }
            .thumbnail-row img.active {
                border: 2px solid var(--primary-green, #2ecc71);
                opacity: 1;
            }
            .mobile-nav a i {
                width: 25px;
                margin-right: 10px;
            }
            @media (max-width: 768px) {
                .navbar {
                    padding: 10px 0 !important;
                }
                .nav-links {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Handle window load
window.addEventListener('load', () => {
    console.log('Window loaded');
    
    // Preload images
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
});

// Error handling for missing elements
window.addEventListener('error', (e) => {
    console.log('Error:', e.message);
});