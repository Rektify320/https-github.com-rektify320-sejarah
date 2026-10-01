/* ==========================================================================
   AUDIO ENGINE DENGAN SUARA BERBEDA-BEDA TIAP TOKOH (SPEECH TTS + SYNTH BLIP)
   ========================================================================== */

// Karakteristik vokal unik per tokoh
const CHARACTER_VOICE_PROFILES = {
  "kala": {
    pitch: 1.6,
    rate: 1.15,
    lang: "id-ID",
    gender: "female",
    blipFreq: 850,
    blipWave: "sine"
  },
    "brooshooft": {
    pitch: 0.90,
    rate: 1.02,
    lang: "id-ID",
    gender: "male",
    blipFreq: 210,
    blipWave: "sawtooth"
  },
  "deventer": {
    pitch: 0.82,
    rate: 0.95,
    lang: "id-ID",
    gender: "male",
    blipFreq: 180,
    blipWave: "triangle"
  },
  "multatuli": {
    pitch: 0.88,
    rate: 0.92,
    lang: "id-ID",
    gender: "male",
    blipFreq: 220,
    blipWave: "sawtooth"
  },
  "wilhelmina": {
    pitch: 1.25,
    rate: 0.98,
    lang: "id-ID",
    gender: "female",
    blipFreq: 620,
    blipWave: "sine"
  },
  "farmer": {
    pitch: 0.76,
    rate: 0.9,
    lang: "id-ID",
    gender: "male",
    blipFreq: 150,
    blipWave: "triangle"
  },
  "kartini": {
    pitch: 1.15,
    rate: 0.92,
    lang: "id-ID",
    gender: "female",
    blipFreq: 480,
    blipWave: "sine"
  },
  "wahidin": {
    pitch: 0.74,
    rate: 0.88,
    lang: "id-ID",
    gender: "male",
    blipFreq: 135,
    blipWave: "triangle"
  },
  "kuli_deli": {
    pitch: 0.85,
    rate: 0.98,
    lang: "id-ID",
    gender: "male",
    blipFreq: 195,
    blipWave: "square"
  },
  "migrant": {
    pitch: 0.92,
    rate: 1.05,
    lang: "id-ID",
    gender: "male",
    blipFreq: 240,
    blipWave: "triangle"
  },
  "soetomo": {
    pitch: 1.05,
    rate: 1.05,
    lang: "id-ID",
    gender: "male",
    blipFreq: 340,
    blipWave: "triangle"
  }
};

class SoundController {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.useSpeechTTS = true; // Mode suara manusia asli (Web Speech API)
    this.bgmTimer = null;
    this.currentUtterance = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.startBGM();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Suara bicara manusia asli berbeda-beda tiap karakter (Web Speech API)
  speakCharacterLine(text, characterKey) {
    if (this.muted || !this.useSpeechTTS) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const profile = CHARACTER_VOICE_PROFILES[characterKey] || CHARACTER_VOICE_PROFILES["kala"];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.lang = "id-ID";

    // Cari suara yang cocok jika tersedia di sistem
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.startsWith('ID'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Suara ketik blip unik per karakter (Web Audio API)
  playTypewriterBlipFor(characterKey) {
    if (this.muted || !this.ctx) return;
    const profile = CHARACTER_VOICE_PROFILES[characterKey] || CHARACTER_VOICE_PROFILES["kala"];

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = profile.blipWave;
      const baseFreq = profile.blipFreq;
      osc.frequency.setValueAtTime(baseFreq + (Math.random() - 0.5) * 40, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e) {}
  }

  playChoiceHover() {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch(e) {}
  }

  playSelect() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);
    } catch(e) {}
  }

  playAchievementFanfare() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.65);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.65);
      });
    } catch(e) {}
  }

  playQuestComplete() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const chords = [523.25, 659.25, 783.99];
      chords.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      });
    } catch(e) {}
  }

  // SFX Langkah Kaki di Rumput / Tanah (Synthesized Footstep)
  playFootstep(isSprinting) {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const baseFreq = isSprinting ? 95 : 75;
      osc.frequency.setValueAtTime(baseFreq + (Math.random() - 0.5) * 20, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.08);

      gain.gain.setValueAtTime(isSprinting ? 0.05 : 0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch(e) {}
  }

  // SFX Buka Peti Harta Karun (Chime & Major Chord Fanfare)
  playChestOpen() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Creak sound
      const creak = this.ctx.createOscillator();
      const creakGain = this.ctx.createGain();
      creak.type = 'sawtooth';
      creak.frequency.setValueAtTime(140, now);
      creak.frequency.exponentialRampToValueAtTime(320, now + 0.18);
      creakGain.gain.setValueAtTime(0.04, now);
      creakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      creak.connect(creakGain);
      creakGain.connect(this.ctx.destination);
      creak.start(now);
      creak.stop(now + 0.18);

      // Gold shimmer chord: C5 - E5 - G5 - C6
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const start = now + 0.12 + i * 0.06;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.8);
      });
    } catch(e) {}
  }

  // SFX Terompet / Harmoni Kemenangan Kelulusan Kuis
  playVictoryTrumpet() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.15 },
        { f: 659.25, d: 0.15 },
        { f: 783.99, d: 0.15 },
        { f: 1046.50, d: 0.55 }
      ];
      let t = now;
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + n.d);
        t += n.d * 0.85;
      });
    } catch(e) {}
  }

  startBGM() {
    if (this.bgmTimer) clearInterval(this.bgmTimer);
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.ctx) return;
      if (Math.random() > 0.35) {
        const freq = scale[Math.floor(Math.random() * scale.length)];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.022, this.ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.8);
      }
    }, 950);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) this.stopSpeaking();
    return !this.muted;
  }

  toggleVoiceMode() {
    this.useSpeechTTS = !this.useSpeechTTS;
    if (!this.useSpeechTTS) this.stopSpeaking();
    return this.useSpeechTTS;
  }
}

const sound = new SoundController();