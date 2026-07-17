// Particle Animation System

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.stars = [];
        this.animationId = null;

        this.setupCanvas();
        this.generateStars();
        this.startAnimation();
        this.setupResizeListener();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    generateStars() {
        const starCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < starCount; i++) {
            const star = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5,
                opacity: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: this.getRandomStarColor()
            };
            this.stars.push(star);
        }
    }

    getRandomStarColor() {
        const colors = ['#ffffff', '#00d4ff', '#0099ff', '#9370db'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createParticle(x, y) {
        const particle = {
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            color: this.getRandomParticleColor(),
            life: Math.random() * 200 + 300,
            maxLife: Math.random() * 200 + 300
        };
        this.particles.push(particle);
    }

    getRandomParticleColor() {
        const colors = ['rgba(0, 212, 255', 'rgba(0, 153, 255', 'rgba(147, 112, 219'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticles() {
        this.particles = this.particles.filter(p => p.life > 0);

        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life--;

            // Remove particles that go off screen
            if (particle.x < 0 || particle.x > this.canvas.width ||
                particle.y < 0 || particle.y > this.canvas.height) {
                particle.life = 0;
            }
        });
    }

    updateStars() {
        const currentTime = Date.now() / 1000;
        
        this.stars.forEach(star => {
            const twinkle = Math.sin(currentTime * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
            star.opacity = 0.3 + twinkle * 0.7;
        });
    }

    draw() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw stars
        this.stars.forEach(star => {
            this.ctx.fillStyle = star.color;
            this.ctx.globalAlpha = star.opacity;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw particles
        this.particles.forEach(particle => {
            const alpha = (particle.life / particle.maxLife) * particle.opacity;
            this.ctx.fillStyle = particle.color + `, ${alpha})`;
            this.ctx.globalAlpha = 1;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.updateParticles();
        this.updateStars();
        this.draw();

        // Randomly create new particles
        if (Math.random() < 0.1) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.3; // Bias towards top
            this.createParticle(x, y);
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.animate();
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('particle-canvas');
});
