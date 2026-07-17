# AVION 2C.2 - Developer Quick Reference

## 🚀 Quick Commands

### Launch Development Server
```bash
# Windows
python -m http.server 8000

# macOS/Linux
python3 -m http.server 8000

# Then visit: http://localhost:8000
```

### File Locations
```
frontend/
├── index.html (main entry point)
├── css/ (11 styling files)
├── js/ (7 controller files)
├── components/ (HTML templates)
└── docs/ (README, CHANGELOG, guides)
```

## 🎯 Component APIs

### Boot Sequence
```javascript
window.bootSequence.complete();    // End boot early
window.bootSequence.skip();        // Skip immediately
window.bootSequence.isComplete;    // Boolean flag
```

### Voice UI
```javascript
window.voiceUIController.startListening();
window.voiceUIController.stopListening();
window.voiceUIController.toggleListening();
window.voiceUIController.handleCommand('Help');
window.voiceUIController.speak('Hello World');
```

### Female Avatar
```javascript
window.femaleAvatarController.startListeningMode();
window.femaleAvatarController.stopListeningMode();
window.femaleAvatarController.updateStatusLights('listening');
window.femaleAvatarController.getAvatarState();
```

### Animations
```javascript
// All static methods on AnimationManager
AnimationManager.fadeInElements('.selector', delay);
AnimationManager.slideInFromLeft('.selector', delay);
AnimationManager.float('.selector', distance, duration);
AnimationManager.pulse('.selector', duration);
AnimationManager.typewrite('.selector', text, speed);
AnimationManager.countUp('.selector', target, duration);
AnimationManager.observeOnScroll('.selector', className, threshold);
```

## 🎨 Color Palette

```css
/* Use in CSS or JavaScript */
Primary Cyan:    #00d4ff  /* UI elements *)
Secondary Blue:  #0099ff  /* Gradients *)
Accent Pink:     #ff0080  /* Female avatar *)
Dark BG:         #0a0e27  (* Background *)
Card BG:         rgba(15, 25, 50, 0.8)
Text Primary:    #ffffff  /* Main text *)
Text Secondary:  #a0a8d8  (* Subtle text *)
Success Green:   #00ff41  (* Success messages *)
```

## 📐 Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1024px) { /* 2-column layout */ }

/* Tablet */
@media (max-width: 1024px) { /* adjusted spacing */ }

/* Mobile */
@media (max-width: 768px) { /* 1-column layout */ }

/* Small Mobile */
@media (max-width: 480px) { /* optimized touch */ }
```

## ⚡ Performance Tips

```javascript
// Enable GPU acceleration
const element = document.querySelector('.element');
element.classList.add('gpu-accelerated');

// Listen for animation end
element.addEventListener('animationend', () => {
    console.log('Animation complete');
});

// Request animation frame for custom animations
const animate = () => {
    // Update element
    requestAnimationFrame(animate);
};
animate();
```

## 🔍 Debugging Commands

```javascript
// Check all controllers
console.log({
    boot: window.bootSequence,
    voice: window.voiceUIController,
    avatar: window.femaleAvatarController
});

// Check boot complete
console.log('Boot complete:', window.bootSequence?.isComplete);

// Check voice state
console.log('Voice listening:', window.voiceUIController?.isListening);

// Check avatar state
console.log('Avatar state:', window.femaleAvatarController?.getAvatarState());

// Check animation
const el = document.querySelector('.female-avatar-container');
console.log('Animation:', getComputedStyle(el).animation);
```

## 🎬 Animation Timing Reference

| Animation | Duration | Timing |
|-----------|----------|--------|
| Boot sequence | 3.5s | Auto-play then fade 0.8s |
| Logo pulse | 1.5s | Repeats, infinite |
| Boot lines | 0.5s each | Staggered 0.2s intervals |
| Progress bar | 2s | Linear fill to 100% |
| Ready indicator | 2.5s delay | Then 1s blink infinite |
| Idle sway | 4s | Avatar breathing |
| Head float | 3s | Vertical movement |
| Eye blink | 3s | Repeated blinks |
| Hair wave | 3s | Side movement |
| Microphone pulse | 2s | Scale + glow (on active) |
| Waveform | Continuous | 60fps rendering |
| Particles | 1.5s-5s | Random twinkling |

## 📦 CSS Utility Classes

```html
<!-- Layout -->
<div class="flex-center">Centered with flex</div>
<div class="grid-2">2-column grid</div>
<div class="gap-4">Element with gap-4</div>

<!-- Spacing -->
<div class="gap-0 gap-1 gap-2 gap-3 gap-4 gap-6 gap-8">Gaps</div>

<!-- Text -->
<p class="text-center font-bold text-2xl">Bold centered text</p>
<span class="uppercase opacity-50">50% opaque uppercase</span>

<!-- Effects -->
<div class="shadow-glow blur-md rounded-lg">Glass container</div>
<div class="gpu-accelerated">Hardware accelerated</div>

<!-- Animations -->
<div class="smooth-animation">Smooth timing</div>
```

## 🐛 Common Issues & Fixes

### Boot doesn't show
```javascript
// Check HTML element exists
const boot = document.getElementById('boot-sequence');
console.log('Boot element:', boot ? 'Found' : 'Missing');

// Check CSS is loaded
const style = document.querySelector('link[href*="boot-sequence"]');
console.log('CSS loaded:', style ? 'Yes' : 'No');
```

### Voice UI not responding
```javascript
// Check controller initialized
console.log('Controller:', window.voiceUIController);

// Check canvas exists
const canvas = document.getElementById('waveform-canvas');
console.log('Canvas:', canvas);

// Check audio context
console.log('Audio context:', window.AudioContext || window.webkitAudioContext);
```

### Avatar animations not playing
```javascript
// Check CSS animation property
const avatar = document.querySelector('.female-avatar-container');
const style = getComputedStyle(avatar);
console.log('Animation:', style.animation);

// Check if reduced motion enabled
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
console.log('Reduced motion:', prefersReduced);
```

### Microphone not working
```javascript
// Check browser support
console.log('MediaDevices:', navigator.mediaDevices ? 'Supported' : 'Not supported');

// Check permission
navigator.permissions.query({ name: 'microphone' })
    .then(r => console.log('Microphone permission:', r.state));

// Request microphone manually
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        console.log('Microphone available');
        stream.getTracks().forEach(t => t.stop());
    })
    .catch(err => console.error('Microphone error:', err));
```

## 📊 Performance Profiling

```javascript
// Measure boot sequence performance
const perfData = performance.getEntriesByName('boot-start');
console.log('Boot timing:', perfData);

// Measure animation FPS
let lastTime = performance.now();
let frames = 0;
const checkFPS = () => {
    frames++;
    const currentTime = performance.now();
    if (currentTime >= lastTime + 1000) {
        console.log('FPS:', frames);
        frames = 0;
        lastTime = currentTime;
    }
    requestAnimationFrame(checkFPS);
};
checkFPS();
```

## 🔐 Security Checklist

- [ ] No API keys in code
- [ ] Microphone permission requested explicitly
- [ ] Audio data not sent anywhere
- [ ] All code is client-side
- [ ] No localStorage abuse
- [ ] No console.logs with sensitive data
- [ ] HTTPS recommended for production
- [ ] CORS headers not needed (local only)

## 📱 Mobile Testing

```javascript
// Detect mobile
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

// Test touch
window.addEventListener('touchstart', () => {
    console.log('Touch detected');
});

// Test orientation
window.addEventListener('orientationchange', () => {
    console.log('Orientation:', window.orientation);
});

// Check viewport
console.log('Viewport width:', window.innerWidth);
console.log('Viewport height:', window.innerHeight);
```

## 🚀 Deployment Checklist

- [ ] All CSS files minified
- [ ] All JS files minified
- [ ] Images optimized
- [ ] No console.errors
- [ ] Accessibility audit passed
- [ ] All animations at 60fps
- [ ] Mobile responsive tested
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] Security reviewed

## 📚 File Dependencies

```
index.html
├── css/main.css (must load first)
├── css/navbar.css
├── css/hero.css
├── css/avatar.css
├── css/avatar-female.css
├── css/particles.css
├── css/glass.css
├── css/status-panel.css
├── css/voice-ui.css
├── css/boot-sequence.css
├── css/polish.css
├── js/boot-sequence.js (runs first)
├── js/particles.js
├── js/avatar.js
├── js/female-avatar.js
├── js/voice-ui.js
├── js/animation.js
└── js/app.js (main app controller)
```

## 🔗 Useful URLs

- **MDN Web Docs**: https://developer.mozilla.org/
- **CSS Variables**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Canvas API**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- **CSS Grid**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
- **Flexbox**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout

---

**Quick Reference for AVION 2C.2 Development**
*Last Updated: Version 2C.2*
