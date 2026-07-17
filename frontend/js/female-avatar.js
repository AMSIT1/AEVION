// Female AI Avatar Controller

class FemaleAvatarController {
    constructor() {
        this.avatar = document.querySelector('.female-avatar-container');
        this.statusLights = document.querySelectorAll('.status-light');
        this.animationState = 'idle';
        this.isListening = false;
        this.listeningTimeout = null;
        this.statusUpdateInterval = null;
        
        if (!this.avatar) return;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startStatusUpdates();
        this.addAnimationStyles();
    }

    setupEventListeners() {
        // Talk button listeners
        const talkButtons = document.querySelectorAll('.primary-button, .cta-button, .nav-talk-button');
        talkButtons.forEach(button => {
            button.addEventListener('click', () => this.handleTalkClick());
        });

        // Avatar interaction
        if (this.avatar) {
            this.avatar.addEventListener('click', () => this.reactToClick());
            this.avatar.addEventListener('mouseenter', () => this.reactToHover());
            this.avatar.addEventListener('mouseleave', () => this.resetReaction());
        }
    }

    handleTalkClick() {
        if (!this.isListening) {
            this.startListeningMode();
        } else {
            this.stopListeningMode();
        }
    }

    startListeningMode() {
        this.isListening = true;
        this.animationState = 'listening';
        
        if (this.avatar) {
            this.avatar.classList.add('listening-active');
            this.avatar.style.animation = 'listening-grow 0.4s ease-out';
        }

        // Add listening indicator
        this.addListeningRing();
        
        // Update status lights
        this.updateStatusLights('listening');

        // Stop after 3 seconds
        this.listeningTimeout = setTimeout(() => {
            this.stopListeningMode();
        }, 3000);
    }

    stopListeningMode() {
        this.isListening = false;
        this.animationState = 'processing';
        
        if (this.listeningTimeout) {
            clearTimeout(this.listeningTimeout);
        }

        // Remove listening ring
        this.removeListeningRing();

        // Show processing state
        if (this.avatar) {
            this.avatar.classList.remove('listening-active');
            this.avatar.style.animation = 'idle-sway 4s ease-in-out infinite';
        }

        // Simulate processing
        this.updateStatusLights('processing');
        
        setTimeout(() => {
            this.animationState = 'idle';
            this.updateStatusLights('idle');
        }, 1500);
    }

    addListeningRing() {
        if (document.querySelector('.listening-ring')) return;

        const ring = document.createElement('div');
        ring.className = 'listening-ring';
        ring.style.cssText = `
            position: absolute;
            width: 350px;
            height: 350px;
            border: 2px solid rgba(0, 212, 255, 0.6);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: listening-expand 0.8s ease-out infinite;
            pointer-events: none;
            z-index: 1;
        `;

        if (this.avatar) {
            this.avatar.parentElement.appendChild(ring);
        }
    }

    removeListeningRing() {
        const ring = document.querySelector('.listening-ring');
        if (ring) {
            ring.remove();
        }
    }

    reactToHover() {
        if (this.avatar && this.animationState === 'idle') {
            this.avatar.style.filter = 'drop-shadow(0 0 40px rgba(0, 212, 255, 0.7))';
            this.avatar.style.transform = 'scale(1.05)';
            this.avatar.style.transition = 'all 0.3s ease';
        }
    }

    resetReaction() {
        if (this.avatar && this.animationState === 'idle') {
            this.avatar.style.filter = 'none';
            this.avatar.style.transform = 'scale(1)';
        }
    }

    reactToClick() {
        if (this.avatar) {
            this.avatar.style.animation = 'click-bounce 0.6s ease-out';
            
            setTimeout(() => {
                this.avatar.style.animation = 'idle-sway 4s ease-in-out infinite';
            }, 600);
        }
    }

    updateStatusLights(state) {
        if (!this.statusLights.length) return;

        switch (state) {
            case 'listening':
                this.statusLights[0].style.background = '#00d4ff';
                this.statusLights[0].style.boxShadow = '0 0 10px #00d4ff';
                this.statusLights[0].style.animation = 'status-listen 0.4s ease-in-out infinite';
                break;

            case 'processing':
                this.statusLights[0].style.background = '#ff9900';
                this.statusLights[0].style.boxShadow = '0 0 10px #ff9900';
                this.statusLights[0].style.animation = 'status-spin 1s linear infinite';
                break;

            case 'idle':
                this.statusLights.forEach((light, index) => {
                    if (index === 0) {
                        light.style.background = '#00ff41';
                        light.style.boxShadow = '0 0 10px #00ff41';
                        light.style.animation = 'status-blink 1.5s ease-in-out infinite';
                    }
                });
                break;
        }
    }

    startStatusUpdates() {
        // Update status values periodically
        this.statusUpdateInterval = setInterval(() => {
            this.updateStatusValues();
        }, 3000);
    }

    updateStatusValues() {
        const statusPanel = document.querySelector('.enhanced-status-panel');
        if (!statusPanel) return;

        // Simulate changing values
        const values = {
            'Intelligence': Math.floor(Math.random() * 10) + 85,
            'Learning': Math.floor(Math.random() * 10) + 70,
            'Voice': Math.floor(Math.random() * 5) + 95,
            'Response': Math.floor(Math.random() * 30) + 35,
            'Energy': Math.floor(Math.random() * 10) + 80
        };

        const rows = statusPanel.querySelectorAll('.status-row');
        rows.forEach((row, index) => {
            const labelValue = row.querySelector('.label-value');
            const progressFill = row.querySelector('.progress-fill');
            
            if (labelValue && progressFill) {
                const key = Object.keys(values)[index];
                const value = values[key];
                const suffix = index === 3 ? 'ms' : '%';
                
                labelValue.textContent = value + suffix;
                progressFill.style.width = value + '%';
            }
        });
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes listening-expand {
                0% {
                    width: 300px;
                    height: 300px;
                    opacity: 0.8;
                }
                100% {
                    width: 450px;
                    height: 450px;
                    opacity: 0;
                }
            }

            @keyframes listening-grow {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }

            @keyframes click-bounce {
                0% {
                    transform: scale(1) translateY(0);
                }
                25% {
                    transform: scale(1.1) translateY(-10px);
                }
                50% {
                    transform: scale(0.95) translateY(0);
                }
                75% {
                    transform: scale(1.05) translateY(-5px);
                }
                100% {
                    transform: scale(1) translateY(0);
                }
            }

            @keyframes status-listen {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.5;
                    transform: scale(0.8);
                }
            }

            @keyframes status-spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }

            @keyframes status-blink {
                0%, 100% {
                    opacity: 0.4;
                    transform: scale(1);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.2);
                }
            }

            .listening-active {
                filter: drop-shadow(0 0 30px rgba(0, 212, 255, 0.8)) !important;
            }
        `;
        document.head.appendChild(style);
    }

    getAvatarState() {
        return {
            isListening: this.isListening,
            animationState: this.animationState,
            position: this.avatar ? this.avatar.getBoundingClientRect() : null
        };
    }

    speak(text) {
        console.log('Avatar speaking:', text);
        // Integrate with text-to-speech API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1.2;
            utterance.volume = 1;
            
            speechSynthesis.speak(utterance);
            
            // Update avatar animation while speaking
            this.animationState = 'speaking';
            this.updateStatusLights('listening');
            
            utterance.onend = () => {
                this.animationState = 'idle';
                this.updateStatusLights('idle');
            };
        }
    }

    destroy() {
        if (this.statusUpdateInterval) {
            clearInterval(this.statusUpdateInterval);
        }
        if (this.listeningTimeout) {
            clearTimeout(this.listeningTimeout);
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.femaleAvatarController = new FemaleAvatarController();
});

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FemaleAvatarController;
}
