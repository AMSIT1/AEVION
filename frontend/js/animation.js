// Animation Utilities

class AnimationManager {
    static fadeInElements(selector, staggerDelay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * staggerDelay);
        });
    }

    static slideInFromLeft(selector, delay = 0) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, delay);
    }

    static slideInFromRight(selector, delay = 0) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, delay);
    }

    static scaleIn(selector, delay = 0) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, delay);
    }

    static pulse(selector, duration = 1000) {
        const element = document.querySelector(selector);
        if (!element) return;

        const animation = `
            @keyframes custom-pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.7;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = animation;
        document.head.appendChild(style);

        element.style.animation = `custom-pulse ${duration}ms ease-in-out infinite`;
    }

    static glow(selector, color = 'rgba(0, 212, 255, 0.5)', blurRadius = 20) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.style.boxShadow = `0 0 ${blurRadius}px ${color}`;
        element.style.transition = 'box-shadow 0.3s ease';
    }

    static removeGlow(selector) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.style.boxShadow = 'none';
    }

    static float(selector, distance = 10, duration = 3000) {
        const element = document.querySelector(selector);
        if (!element) return;

        const animation = `
            @keyframes float-animation {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-${distance}px);
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = animation;
        document.head.appendChild(style);

        element.style.animation = `float-animation ${duration}ms ease-in-out infinite`;
    }

    static shake(selector, intensity = 10, duration = 500) {
        const element = document.querySelector(selector);
        if (!element) return;

        const start = Date.now();
        const shakeInterval = setInterval(() => {
            const elapsed = Date.now() - start;
            
            if (elapsed >= duration) {
                clearInterval(shakeInterval);
                element.style.transform = 'none';
                return;
            }

            const x = (Math.random() - 0.5) * intensity;
            const y = (Math.random() - 0.5) * intensity;
            element.style.transform = `translate(${x}px, ${y}px)`;
        }, 50);
    }

    static typewrite(selector, text, speed = 50) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.textContent = '';
        let index = 0;

        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    static countUp(selector, target, duration = 2000) {
        const element = document.querySelector(selector);
        if (!element) return;

        const start = Date.now();
        const startValue = parseInt(element.textContent) || 0;

        const update = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(startValue + (target - startValue) * progress);
            
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        update();
    }

    static observeOnScroll(selector, className = 'visible', threshold = 0.5) {
        const elements = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold });

        elements.forEach(el => observer.observe(el));
    }

    static createScrollReveal(options = {}) {
        const {
            selector = '.reveal',
            duration = 0.6,
            delay = 0,
            distance = 50
        } = options;

        const elements = document.querySelectorAll(selector);
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = `translateY(${distance}px)`;
            el.style.transition = `all ${duration}s ease-out`;
            el.style.transitionDelay = `${delay + index * 0.1}s`;
        });

        window.addEventListener('scroll', () => {
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            });
        });
    }

    static setupPageTransition(selector = '.page-transition') {
        const element = document.querySelector(selector);
        if (!element) return;

        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease-in-out';

        setTimeout(() => {
            element.style.opacity = '1';
        }, 100);
    }
}

// ScrollReveal integration helper
class ScrollRevealHelper {
    static setup() {
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                origin: 'bottom',
                distance: '60px',
                duration: 800,
                delay: 100,
                easing: 'cubic-bezier(0.5, 0, 0, 1)'
            });

            sr.reveal('.hero-text', { delay: 200 });
            sr.reveal('.avatar-container', { delay: 300, origin: 'right' });
            sr.reveal('.hero-heading', { delay: 100 });
            sr.reveal('.tagline p', { delay: 150, interval: 50 });
            sr.reveal('.cta-button', { delay: 200 });
        }
    }
}

// Initialize animations on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Fade in hero elements
    AnimationManager.fadeInElements('.hero-content > div', 150);
    
    // Setup scroll reveal
    ScrollRevealHelper.setup();
    
    // Float animation for avatar
    AnimationManager.float('.avatar-container', 15, 3000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationManager,
        ScrollRevealHelper
    };
}
