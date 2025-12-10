import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const SoundContext = createContext();

// Web Audio API based sound generator - Minecraft-style ambient
class SoundGenerator {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
    this.ambientNodes = null;
    this.isAmbientPlaying = false;
    this.melodyInterval = null;
  }

  init() {
    if (this.initialized) return true;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
      return true;
    } catch (e) {
      console.warn('Web Audio API not supported');
      return false;
    }
  }

  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (e) {
        console.warn('Could not resume audio context');
      }
    }
  }

  async playClick() {
    if (!this.audioContext) return;
    await this.resume();
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  async playHover() {
    if (!this.audioContext) return;
    await this.resume();
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.03);
    
    gainNode.gain.setValueAtTime(0.04, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.03);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.03);
  }

  async playToggleOn() {
    if (!this.audioContext) return;
    await this.resume();
    
    // Play a gentle arpeggio as toggle sound
    const notes = [261.63, 329.63, 392, 523.25]; // C E G C
    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      const startTime = this.audioContext.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  async playToggleOff() {
    if (!this.audioContext) return;
    await this.resume();
    
    // Descending arpeggio
    const notes = [523.25, 392, 329.63, 261.63]; // C G E C (descending)
    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      const startTime = this.audioContext.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, startTime + 0.25);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Play a single piano-like note with reverb feel
  playNote(freq, duration = 2, volume = 0.12, delay = 0) {
    if (!this.audioContext) return;

    const startTime = this.audioContext.currentTime + delay;
    
    // Main tone
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    // Soft sine wave
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);
    
    // Add slight harmonic for warmth
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime); // Octave up
    
    const osc2Gain = this.audioContext.createGain();
    osc2Gain.gain.setValueAtTime(0.15, startTime); // Much quieter
    
    // Soft lowpass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, startTime);
    filter.Q.setValueAtTime(0.5, startTime);
    
    // Piano-like envelope: quick attack, slow decay
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02); // Quick attack
    gain.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    // Connect
    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientNodes?.masterGain || this.audioContext.destination);
    
    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  async startAmbient() {
    if (!this.audioContext || this.isAmbientPlaying) return;
    await this.resume();

    // Master gain
    const masterGain = this.audioContext.createGain();
    masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 3);
    masterGain.connect(this.audioContext.destination);

    const oscillators = [];

    // Soft pad underneath (like Minecraft's ambient bed)
    const createPad = (freq, vol) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
      
      gain.gain.setValueAtTime(vol, this.audioContext.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    };

    // Very soft, low drone pad
    createPad(65.41, 0.25);  // C2
    createPad(98, 0.15);     // G2
    createPad(130.81, 0.1);  // C3

    this.ambientNodes = { masterGain, oscillators };
    this.isAmbientPlaying = true;

    // Pentatonic scale notes (C major pentatonic - peaceful, Minecraft-like)
    // C D E G A in different octaves
    const pentatonic = [
      261.63, 293.66, 329.63, 392.00, 440.00,  // C4 D4 E4 G4 A4
      523.25, 587.33, 659.25, 783.99, 880.00,  // C5 D5 E5 G5 A5
      196.00, 220.00, 246.94,                   // G3 A3 B3
    ];

    // Melodic patterns inspired by Minecraft
    const patterns = [
      [0, 4, 2, 5],      // Arpeggio up
      [5, 2, 4, 0],      // Arpeggio down  
      [0, 2, 4, 7],      // Scale run
      [7, 5, 4, 2],      // Scale down
      [0, 5, 3, 7],      // Jumpy
      [4, 0, 5, 2],      // Mixed
      [0, 7, 4, 9],      // Wide intervals
      [9, 5, 7, 0],      // Descending wide
    ];

    let currentPattern = 0;
    let noteIndex = 0;
    let lastNote = -1;

    // Play gentle melody notes
    const playMelody = () => {
      if (!this.isAmbientPlaying) return;

      const pattern = patterns[currentPattern];
      const scaleIndex = pattern[noteIndex];
      const freq = pentatonic[scaleIndex];
      
      // Avoid repeating the same note
      if (scaleIndex !== lastNote) {
        // Random variations
        const duration = 2 + Math.random() * 2; // 2-4 seconds
        const volume = 0.08 + Math.random() * 0.06; // Varied volume
        
        this.playNote(freq, duration, volume);
        
        // Sometimes play a harmony note
        if (Math.random() > 0.6) {
          const harmonyIndex = (scaleIndex + 2) % pentatonic.length;
          this.playNote(pentatonic[harmonyIndex], duration * 0.8, volume * 0.5, 0.1);
        }
        
        // Occasionally play an octave
        if (Math.random() > 0.8) {
          this.playNote(freq / 2, duration * 1.2, volume * 0.3, 0.2);
        }
        
        lastNote = scaleIndex;
      }

      noteIndex++;
      if (noteIndex >= pattern.length) {
        noteIndex = 0;
        // Move to next pattern, with some randomness
        if (Math.random() > 0.5) {
          currentPattern = Math.floor(Math.random() * patterns.length);
        } else {
          currentPattern = (currentPattern + 1) % patterns.length;
        }
      }
    };

    // Start melody after a short delay
    setTimeout(() => {
      if (this.isAmbientPlaying) {
        playMelody();
        // Play notes every 1.5-3 seconds (randomized for natural feel)
        this.melodyInterval = setInterval(() => {
          if (this.isAmbientPlaying) {
            playMelody();
          }
        }, 1500 + Math.random() * 1500);
      }
    }, 2000);

    // Add occasional high shimmery notes (like Minecraft's sparkle sounds)
    const playShimmer = () => {
      if (!this.isAmbientPlaying) return;
      
      const highNotes = [1318.51, 1567.98, 1760, 2093]; // E6, G6, A6, C7
      const note = highNotes[Math.floor(Math.random() * highNotes.length)];
      
      this.playNote(note, 3, 0.03); // Very quiet, long decay
      
      // Schedule next shimmer
      if (this.isAmbientPlaying) {
        setTimeout(playShimmer, 8000 + Math.random() * 12000); // Every 8-20 seconds
      }
    };

    // Start shimmers after 5 seconds
    setTimeout(() => {
      if (this.isAmbientPlaying) playShimmer();
    }, 5000);
  }

  stopAmbient() {
    if (!this.audioContext || !this.ambientNodes || !this.isAmbientPlaying) return;

    // Stop melody
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }

    const { masterGain, oscillators } = this.ambientNodes;
    const now = this.audioContext.currentTime;

    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 2);

    this.isAmbientPlaying = false;

    setTimeout(() => {
      oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      this.ambientNodes = null;
    }, 2100);
  }
}

export const SoundProvider = ({ children }) => {
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved === 'true';
  });
  
  const soundGenerator = useRef(null);

  useEffect(() => {
    soundGenerator.current = new SoundGenerator();
  }, []);

  useEffect(() => {
    localStorage.setItem('musicEnabled', musicEnabled.toString());
  }, [musicEnabled]);

  const initSound = useCallback(() => {
    if (soundGenerator.current) {
      return soundGenerator.current.init();
    }
    return false;
  }, []);

  const toggleMusic = useCallback(async () => {
    const initialized = initSound();
    if (!initialized) return;
    
    setMusicEnabled(prev => {
      const newValue = !prev;
      if (soundGenerator.current && soundGenerator.current.initialized) {
        if (newValue) {
          soundGenerator.current.playToggleOn();
          setTimeout(() => {
            soundGenerator.current.startAmbient();
          }, 400);
        } else {
          soundGenerator.current.playToggleOff();
          soundGenerator.current.stopAmbient();
        }
      }
      return newValue;
    });
  }, [initSound]);

  const playClick = useCallback(() => {
    if (soundGenerator.current) {
      initSound();
      soundGenerator.current.playClick();
    }
  }, [initSound]);

  const playHover = useCallback(() => {
    if (soundGenerator.current) {
      initSound();
      soundGenerator.current.playHover();
    }
  }, [initSound]);

  return (
    <SoundContext.Provider value={{
      musicEnabled,
      toggleMusic,
      playClick,
      playHover,
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export default SoundContext;
