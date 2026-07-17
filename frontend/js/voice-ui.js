// Voice UI Controller

class VoiceUIController {
    constructor() {
        this.voiceButton = document.querySelector('.voice-button');
        this.waveformCanvas = document.getElementById('waveform-canvas');
        this.isListening = false;
        this.audioContext = null;
        this.analyser = null;
        this.mediaStream = null;
        this.animationId = null;
        this.transcriptionText = document.querySelector('.transcription-text');
        this.transcriptionTime = document.querySelector('.transcription-time');
        this.listeningTime = 0;
        this.timeInterval = null;

        if (this.voiceButton) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.initializeAudioContext();
        this.startWaveformAnimation();
    }

    setupEventListeners() {
        this.voiceButton.addEventListener('click', () => this.toggleListening());

        // Command buttons
        const commandButtons = document.querySelectorAll('.command-button');
        commandButtons.forEach(button => {
            button.addEventListener('click', () => this.handleCommand(button.dataset.command));
        });
    }

    initializeAudioContext() {
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.warn('Web Audio API not supported');
            return;
        }

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    async startListening() {
        try {
            this.isListening = true;
            this.voiceButton.classList.add('active');
            this.voiceButton.querySelector('.voice-button-text').textContent = 'Listening...';

            // Update status
            this.updateStatus('Listening...', '#00d4ff');
            console.log('🎙️ Voice UI: Starting listen mode');

            // Request microphone
            if (!this.mediaStream && this.audioContext) {
                try {
                    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const source = this.audioContext.createMediaStreamAudioSource(this.mediaStream);
                    source.connect(this.analyser);
                    console.log('✅ Microphone connected to audio context');
                } catch (micError) {
                    console.warn('⚠️ Could not access microphone:', micError.message);
                    // Continue in demo mode without microphone
                }
            } else if (!this.audioContext) {
                console.warn('⚠️ Audio context not available, using demo mode');
            }

            // Start transcription simulation
            this.startTranscriptionSimulation();

            // Start time tracking
            this.startTimeTracking();

        } catch (error) {
            console.error('Microphone access denied:', error);
            this.updateStatus('Microphone access denied', '#ff0080');
            this.isListening = false;
            this.voiceButton.classList.remove('active');
        }
    }

    stopListening() {
        this.isListening = false;
        this.voiceButton.classList.remove('active');
        this.voiceButton.querySelector('.voice-button-text').textContent = 'Start Listening';

        // Stop media stream
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

        // Stop time tracking
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }

        // Stop transcription
        this.transcriptionText.classList.remove('placeholder');

        // Update status
        this.updateStatus('Ready to listen', '#a0a8d8');
    }

    startTranscriptionSimulation() {
        const sampleTexts = [
            'Good morning, how can you help?',
            'Tell me about the weather',
            'Set a reminder for tomorrow',
            'What is the time?',
            'Play some music'
        ];

        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        let currentText = '';
        let charIndex = 0;

        const typeText = () => {
            if (charIndex < randomText.length && this.isListening) {
                currentText += randomText[charIndex];
                this.transcriptionText.textContent = currentText;
                charIndex++;
                setTimeout(typeText, 80);
            }
        };

        typeText();
    }

    startTimeTracking() {
        this.listeningTime = 0;
        this.updateTimeDisplay();

        this.timeInterval = setInterval(() => {
            this.listeningTime++;
            this.updateTimeDisplay();
        }, 1000);
    }

    updateTimeDisplay() {
        const minutes = Math.floor(this.listeningTime / 60);
        const seconds = this.listeningTime % 60;
        this.transcriptionTime.textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateStatus(text, color = '#a0a8d8') {
        const statusText = document.querySelector('.voice-status-text');
        if (statusText) {
            statusText.textContent = text;
            statusText.style.color = color;
        }
    }

    startWaveformAnimation() {
        if (!this.waveformCanvas) return;

        const ctx = this.waveformCanvas.getContext('2d');
        const width = this.waveformCanvas.width;
        const height = this.waveformCanvas.height;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw waveform
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();

            if (this.isListening && this.analyser) {
                // Real waveform from microphone
                const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                this.analyser.getByteTimeDomainData(dataArray);

                const sliceWidth = (width * 1.0) / dataArray.length;
                let x = 0;

                for (let i = 0; i < dataArray.length; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = (v * height) / 2;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }
            } else {
                // Idle waveform
                const time = Date.now() / 500;
                const sliceWidth = width / 100;

                for (let i = 0; i < 100; i++) {
                    const y = height / 2 + Math.sin(time + i * 0.1) * height * 0.3;
                    const x = i * sliceWidth;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            }

            ctx.stroke();

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    handleCommand(command) {
        this.transcriptionText.textContent = `Command: ${command}`;
        this.transcriptionText.classList.remove('placeholder');

        console.log('Command executed:', command);

        // Execute command
        switch (command) {
            case 'Help':
                this.showHelp();
                break;
            case 'Status':
                this.showStatus();
                break;
            case 'Settings':
                this.showSettings();
                break;
            case 'Exit':
                this.exitVoiceMode();
                break;
        }
    }

    showHelp() {
        const message = `Available commands: Help, Status, Settings, Exit. You can also speak naturally to Avion.`;
        this.transcriptionText.textContent = message;
    }

    showStatus() {
        const message = `System Status: AI Core Online, Voice Engine Active, Neural Network Synchronized.`;
        this.transcriptionText.textContent = message;
    }

    showSettings() {
        const message = `Voice Settings: Microphone Enabled, Transcription Active, Feedback Enabled.`;
        this.transcriptionText.textContent = message;
    }

    exitVoiceMode() {
        this.stopListening();
        this.transcriptionText.textContent = 'Voice mode exited. Returning to main interface...';
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.voiceUIController = new VoiceUIController();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceUIController;
}
