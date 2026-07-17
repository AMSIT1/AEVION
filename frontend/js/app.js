// AVION 2C.2 - Main Application Controller

console.log('🚀 AVION 2C.2 - Intelligent AI Companion');

class AvionApp {
    constructor() {
        this.navbar = document.querySelector('nav');
        this.isScrolling = false;
        this.bootComplete = false;
        this.init();
    }

    init() {
        console.log('📱 Initializing AVION 2C.2...');
        
        // Wait for boot sequence to complete
        setTimeout(() => {
            this.bootComplete = true;
            this.setupNavbar();
            this.setupScrollEffects();
            this.setupEventListeners();
            this.setupResponsive();
            this.initializeComponents();
            console.log('✨ AVION 2C.2 Ready');
        }, 100);
    }

    initializeComponents() {
        // Female Avatar Controller
        if (window.FemaleAvatarController) {
            window.femaleAvatarController = new FemaleAvatarController();
            console.log('👩 Female Avatar initialized');
        }

        // Voice UI Controller
        if (window.VoiceUIController) {
            window.voiceUIController = new VoiceUIController();
            console.log('🎙️ Voice UI initialized');
        }

        // Boot Sequence Controller
        if (window.BootSequence) {
            console.log('⏱️ Boot Sequence completed');
        }
    }

    setupNavbar() {
        if (!this.navbar) return;

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
                this.isScrolling = true;
            } else {
                this.navbar.classList.remove('scrolled');
                this.isScrolling = false;
            }
        });

        // Smooth scroll for navigation links
        const navLinks = document.querySelectorAll('.menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScroll(href);
                }
            });
        });
    }

    smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    setupScrollEffects() {
        // Parallax effect on hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                heroSection.style.transform = `translateY(${scrollY * 0.5}px)`;
            });
        }

        // Fade in elements on scroll
        this.observeElements();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.1
        });

        const elements = document.querySelectorAll('section, .card, .status-row, .voice-ui-container');
        elements.forEach(el => observer.observe(el));
    }

    setupEventListeners() {
        // CTA Button and Primary buttons
        const primaryButtons = document.querySelectorAll('.primary-button, .cta-button');
        primaryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleTalkButtonClick(e);
            });

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-5px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });

        // Navigation talk button
        const navTalkButton = document.querySelector('.nav-talk-button');
        if (navTalkButton) {
            navTalkButton.addEventListener('click', (e) => {
                this.handleTalkButtonClick(e);
            });
        }

        // Avatar interaction
        const avatarContainer = document.querySelector('.female-avatar-container');
        if (avatarContainer) {
            avatarContainer.addEventListener('click', () => {
                if (window.femaleAvatarController) {
                    window.femaleAvatarController.handleTalkClick?.();
                }
            });
        }
    }

    handleTalkButtonClick(e) {
        e?.preventDefault?.();
        
        // Use Voice UI if available
        if (window.voiceUIController && !window.voiceUIController.isListening) {
            window.voiceUIController.toggleListening();
            return;
        }

        // Check if microphone access is available
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            this.requestMicrophone();
        } else {
            this.showMessage('🔊 Microphone not available in your browser', 'warning');
        }
    }

    requestMicrophone() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                this.startListening(stream);
            })
            .catch((error) => {
                console.error('🚫 Microphone access denied:', error);
                this.showMessage('🚫 Microphone access denied', 'error');
            });
    }

    startListening(stream) {
        const button = document.querySelector('.primary-button');
        if (button && window.femaleAvatarController) {
            button.textContent = '🎤 Listening...';
            button.disabled = true;
            window.femaleAvatarController.startListeningMode();

            // Simulate listening for 3 seconds
            setTimeout(() => {
                this.stopListening(stream, button);
            }, 3000);
        }
    }

    stopListening(stream, button) {
        stream.getTracks().forEach(track => track.stop());
        
        if (button) {
            button.innerHTML = '<span class="button-icon">🎤</span><span>Talk to Avion</span>';
            button.disabled = false;
        }

        if (window.femaleAvatarController) {
            window.femaleAvatarController.stopListeningMode();
        }

        this.showMessage('✅ Listening complete. How can I help?', 'success');
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `notification notification-${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slide-in-right 0.3s ease-out;
            backdrop-filter: blur(10px);
            border: 1px solid ${this.getNotificationBorder(type)};
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slide-in-left 0.3s ease-out reverse';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    getNotificationColor(type) {
        const colors = {
            'success': 'rgba(0, 255, 65, 0.8)',
            'error': 'rgba(255, 100, 100, 0.8)',
            'warning': 'rgba(255, 193, 7, 0.8)',
            'info': 'rgba(0, 212, 255, 0.8)'
        };
        return colors[type] || colors['info'];
    }

    getNotificationBorder(type) {
        const borders = {
            'success': 'rgba(0, 255, 65, 0.5)',
            'error': 'rgba(255, 100, 100, 0.5)',
            'warning': 'rgba(255, 193, 7, 0.5)',
            'info': 'rgba(0, 212, 255, 0.5)'
        };
        return borders[type] || borders['info'];
    }

    setupResponsive() {
        // Handle responsive navbar
        this.handleMobileMenu();
    }

    handleMobileMenu() {
        // Add mobile menu toggle if needed
        const menu = document.querySelector('.menu');
        const nav = document.querySelector('nav');

        if (window.innerWidth <= 480 && menu && nav) {
            if (!document.querySelector('.menu-toggle')) {
                const toggle = document.createElement('button');
                toggle.className = 'menu-toggle';
                toggle.textContent = '☰';
                toggle.addEventListener('click', () => {
                    menu.classList.toggle('active');
                });
                nav.appendChild(toggle);
            }
        }

        // Close menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && menu) {
                menu.classList.remove('active');
            }
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AvionApp();
    });
} else {
    new AvionApp();
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in-right {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slide-in-left {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    .in-view {
        animation: fade-in 0.6s ease-out;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

console.log('✨ AVION 2C.2 Application script loaded');
