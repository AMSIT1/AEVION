// Boot Sequence Controller

class BootSequence {
    constructor() {
        this.bootElement = document.getElementById('boot-sequence');
        this.isComplete = false;
        
        if (this.bootElement) {
            this.init();
        }
    }

    init() {
        this.animate();
    }

    animate() {
        // Boot sequence timing
        const bootTimings = [
            { time: 0.2, label: 'Initializing System...' },
            { time: 0.4, label: 'Loading AI Core...' },
            { time: 0.6, label: 'Initializing Voice Engine...' },
            { time: 0.8, label: 'Calibrating Neural Network...' },
            { time: 1.0, label: 'Synchronizing Protocols...' },
            { time: 1.2, label: 'Boot Complete' }
        ];

        // Auto-dismiss after 3.5 seconds
        setTimeout(() => {
            this.complete();
        }, 3500);
    }

    complete() {
        if (this.bootElement) {
            this.bootElement.classList.add('boot-complete');
            
            setTimeout(() => {
                this.bootElement.style.display = 'none';
                this.isComplete = true;
            }, 500);
        }
    }

    skip() {
        this.complete();
    }
}

// Initialize boot sequence
document.addEventListener('DOMContentLoaded', () => {
    const bootElement = document.getElementById('boot-sequence');
    if (bootElement) {
        window.bootSequence = new BootSequence();
        
        // Allow user to skip by clicking
        bootElement.addEventListener('click', () => {
            window.bootSequence.skip();
        });

        // Allow user to skip with keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !window.bootSequence.isComplete) {
                window.bootSequence.skip();
            }
        });
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BootSequence;
}
