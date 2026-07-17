// Avatar Interaction System

class AvatarController {
    constructor() {
        this.avatar = document.querySelector('.avatar-container');
        this.avatarCore = document.querySelector('.avatar-core');
        this.isListening = false;
        this.setupListeners();
        this.setupInteractions();
    }

    setupListeners() {
        // Microphone interaction
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Talk') || button.classList.contains('primary-button')) {
                button.addEventListener('click', () => this.toggleListening());
                button.addEventListener('mouseenter', () => this.avatarReact('hover'));
                button.addEventListener('mouseleave', () => this.avatarReact('idle'));
            }
        });

        // Avatar hover effects
        if (this.avatar) {
            this.avatar.addEventListener('mouseenter', () => this.avatarReact('hover'));
            this.avatar.addEventListener('mouseleave', () => this.avatarReact('idle'));
            this.avatar.addEventListener('click', () => this.avatarReact('click'));
        }
    }

    toggleListening() {
        this.isListening = !this.isListening;
        if (this.isListening) {
            this.startListening();
        } else {
            this.stopListening();
        }
    }

    startListening() {
        if (!this.avatarCore) return;
        
        this.avatarCore.style.animation = 'none';
        setTimeout(() => {
            this.avatarCore.style.animation = 'listening-pulse 0.3s ease-in-out infinite';
        }, 10);

        this.addListeningIndicator();
    }

    stopListening() {
        if (!this.avatarCore) return;
        
        this.avatarCore.style.animation = 'core-pulse 3s ease-in-out infinite';
        this.removeListeningIndicator();
    }

    addListeningIndicator() {
        let indicator = document.querySelector('.listening-indicator');
        if (indicator) return;

        indicator = document.createElement('div');
        indicator.className = 'listening-indicator';
        indicator.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid rgba(0, 212, 255, 0.6);
            animation: listening-ring 1s ease-out infinite;
            pointer-events: none;
        `;

        if (this.avatar) {
            this.avatar.appendChild(indicator);
        }
    }

    removeListeningIndicator() {
        const indicator = document.querySelector('.listening-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    avatarReact(action) {
        if (!this.avatar) return;

        switch (action) {
            case 'hover':
                this.avatar.style.filter = 'drop-shadow(0 0 40px rgba(0, 212, 255, 0.6))';
                break;
            case 'click':
                this.createClickRipple();
                break;
            case 'idle':
                this.avatar.style.filter = 'none';
                break;
        }
    }

    createClickRipple() {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 250px;
            height: 250px;
            border: 2px solid rgba(0, 212, 255, 0.8);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: ripple-effect 0.6s ease-out;
            pointer-events: none;
        `;

        if (this.avatar) {
            this.avatar.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    }

    setupInteractions() {
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes listening-pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            @keyframes listening-ring {
                0% {
                    width: 150px;
                    height: 150px;
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
                100% {
                    width: 350px;
                    height: 350px;
                    opacity: 0;
                    transform: translate(-50%, -50%);
                }
            }

            @keyframes ripple-effect {
                0% {
                    width: 250px;
                    height: 250px;
                    opacity: 1;
                }
                100% {
                    width: 450px;
                    height: 450px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Status indicator system
    updateStatus(status) {
        const card = document.querySelector('.avatar-card');
        if (!card) return;

        const statusItems = card.querySelectorAll('.status-item');
        statusItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(status.toLowerCase())) {
                item.classList.add('active');
            }
        });
    }

    getAvatarState() {
        return {
            isListening: this.isListening,
            position: this.avatar ? this.avatar.getBoundingClientRect() : null
        };
    }
}

// Initialize avatar controller
document.addEventListener('DOMContentLoaded', () => {
    window.avatarController = new AvatarController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AvatarController;
}
