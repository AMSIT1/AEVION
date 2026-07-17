// Voice Greeting Controller - Welcome message on page load
// Enhanced version with better voice support and debugging

class VoiceGreeting {
    constructor() {
        this.hasSpoken = false;
        this.utterance = null;
        this.isSpeaking = false;
        this.isAvailable = false;
        this.voicesReady = false;
        this.greeting = "Welcome to AVION World";
        
        console.log('🎤 VoiceGreeting: Initializing...');
        this.init();
    }

    init() {
        // Check if speech synthesis is available
        if (!('speechSynthesis' in window)) {
            console.error('❌ Speech Synthesis not available in this browser');
            return;
        }

        this.isAvailable = true;
        console.log('✅ Speech Synthesis available');

        // Load voices immediately
        this.loadVoices();

        // Attempt autoplay with faster timeout
        setTimeout(() => {
            if (!this.hasSpoken && this.isAvailable) {
                console.log('🔔 Auto-playing greeting...');
                this.playGreeting();
            }
        }, 500);

        // Fallback: Play after first user interaction if autoplay fails
        const playAfterInteraction = () => {
            if (!this.hasSpoken && this.isAvailable) {
                console.log('🎯 Playing greeting after user interaction');
                this.playGreeting();
                document.removeEventListener('click', playAfterInteraction);
                document.removeEventListener('touchstart', playAfterInteraction);
            }
        };

        document.addEventListener('click', playAfterInteraction, { once: false });
        document.addEventListener('touchstart', playAfterInteraction, { once: false });
    }

    loadVoices() {
        // Voices might already be loaded
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            console.log(`✅ ${voices.length} voices already loaded`);
            this.voicesReady = true;
            return;
        }

        console.log('🔄 Waiting for voices to load...');
        
        // Wait for voices to load
        const checkVoices = () => {
            const loadedVoices = speechSynthesis.getVoices();
            if (loadedVoices.length > 0) {
                console.log(`✅ ${loadedVoices.length} voices loaded`);
                this.voicesReady = true;
                
                // Play greeting once voices are ready
                if (!this.hasSpoken && !this.isSpeaking) {
                    setTimeout(() => this.playGreeting(), 100);
                }
            }
        };

        speechSynthesis.onvoiceschanged = checkVoices;
        
        // Also check periodically in case onvoiceschanged doesn't fire
        let attempts = 0;
        const intervalCheck = setInterval(() => {
            checkVoices();
            attempts++;
            if (this.voicesReady || attempts > 10) {
                clearInterval(intervalCheck);
            }
        }, 200);
    }

    playGreeting() {
        if (!this.isAvailable) {
            console.warn('⚠️ Voice not available');
            return;
        }

        if (this.hasSpoken || this.isSpeaking) {
            console.log('ℹ️ Already spoken or speaking');
            return;
        }

        console.log('🗣️ Playing greeting:', this.greeting);
        
        this.speak(this.greeting, {
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0
        });

        this.hasSpoken = true;
        this.showVoiceIndicator();
    }

    showVoiceIndicator() {
        // Visual feedback that voice is playing
        const indicator = document.createElement('div');
        indicator.id = 'voice-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00d4ff, #0099ff);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
        `;
        indicator.innerHTML = `<span style="display: inline-block; animation: pulse 1s infinite;">🎤</span> AVION Speaking...`;
        document.body.appendChild(indicator);

        // Remove after 3 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 3000);
    }

    speak(text, options = {}) {
        if (this.isSpeaking) {
            console.warn('⏸️ Already speaking');
            return;
        }

        try {
            speechSynthesis.cancel();

            this.utterance = new SpeechSynthesisUtterance(text);
            this.utterance.rate = Math.max(0.1, Math.min(10, options.rate || 1.0));
            this.utterance.pitch = Math.max(0.1, Math.min(2, options.pitch || 1.0));
            this.utterance.volume = Math.max(0, Math.min(1, options.volume !== undefined ? options.volume : 1.0));
            this.utterance.lang = 'en-US';

            const voices = speechSynthesis.getVoices();
            console.log(`🎵 Voices available: ${voices.length}`);
            
            if (voices.length > 0) {
                const voice = this.selectBestVoice(voices);
                if (voice) {
                    this.utterance.voice = voice;
                    console.log(`🎤 Voice: ${voice.name} (${voice.lang})`);
                }
            }
        } catch (error) {
            console.error('❌ Setup error:', error);
            return;
        }

        this.utterance.onstart = () => {
            this.isSpeaking = true;
            console.log('▶️ Speaking...');
        };

        this.utterance.onend = () => {
            this.isSpeaking = false;
            console.log('✅ Done');
        };

        this.utterance.onerror = (event) => {
            console.error(`❌ Error: ${event.error}`);
            this.isSpeaking = false;
        };

        try {
            speechSynthesis.speak(this.utterance);
            console.log('✨ Speaking');
        } catch (error) {
            console.error('❌ Speak error:', error);
            this.isSpeaking = false;
        }
    }

    selectBestVoice(voices) {
        // Priority 1: Look for Zira (female) explicitly
        let voice = voices.find(v => v.name.toLowerCase().includes('zira'));
        if (voice) {
            console.log('✨ Found Zira voice');
            return voice;
        }

        // Priority 2: Look for other female voices
        voice = voices.find(v => 
            (v.lang.includes('en-US') || v.lang.includes('en_US')) &&
            (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
        );
        if (voice) {
            console.log('✨ Found female voice');
            return voice;
        }

        // Priority 3: English US voices
        voice = voices.find(v => v.lang.includes('en-US'));
        if (voice) {
            console.log('✨ Found English US voice');
            return voice;
        }

        // Priority 4: Any English voice
        voice = voices.find(v => v.lang.startsWith('en'));
        if (voice) {
            console.log('✨ Found English voice');
            return voice;
        }

        // Fallback: first available
        console.log('⚠️ Using first available voice:', voices[0].name);
        return voices[0];
    }

    stop() {
        speechSynthesis.cancel();
        this.isSpeaking = false;
        console.log('⏹️ Stopped');
    }

    playManually() {
        this.hasSpoken = false;
        this.playGreeting();
    }

    isTalking() {
        return this.isSpeaking;
    }

    getStatus() {
        const voices = speechSynthesis.getVoices();
        return {
            initialized: true,
            hasSpoken: this.hasSpoken,
            isSpeaking: this.isSpeaking,
            available: this.isAvailable,
            voicesCount: voices.length,
            synthStatus: speechSynthesis.speaking ? 'speaking' : (speechSynthesis.pending ? 'pending' : 'idle')
        };
    }
}

// Debug and test functions
window.avionTestVoice = () => {
    console.clear();
    console.log('%c=== AVION Voice System Test ===', 'color: #00d4ff; font-weight: bold; font-size: 14px;');
    
    if (!window.voiceGreeting) {
        console.error('❌ Voice greeting not initialized');
        return;
    }

    const status = window.voiceGreeting.getStatus();
    console.table(status);
    
    console.log('\\n🎙️ Testing speech now...');
    window.voiceGreeting.speak('Welcome to AVION World. This is a test.');
    
    console.log('\\n💡 Available commands:');
    console.log('  window.voiceGreeting.playManually() - Replay greeting');
    console.log('  window.voiceGreeting.speak("text") - Say any text');
    console.log('  window.voiceGreeting.stop() - Stop speaking');
    console.log('  window.avionTestVoice() - Run this test');
};

// Auto-initialize when script loads
console.log('%c🎤 Voice Greeting Script Loading...', 'color: #00d4ff; font-weight: bold;');

if (!window.voiceGreeting) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 DOM ready - initializing voice');
            window.voiceGreeting = new VoiceGreeting();
        });
    } else {
        console.log('📄 DOM already loaded - initializing voice');
        window.voiceGreeting = new VoiceGreeting();
    }
} else {
    console.log('ℹ️ Voice greeting already exists');
}

console.log('%c✅ Voice Greeting script loaded. Run avionTestVoice() to test.', 'color: #00ff41;');

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceGreeting;
}
