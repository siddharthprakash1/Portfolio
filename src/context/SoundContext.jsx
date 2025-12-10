import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const SoundContext = createContext();

// Web Audio API based sound generator
class SoundGenerator {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
    this.ambientNodes = null;
    this.isAmbientPlaying = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  // Resume audio context if suspended (needed for browsers)
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Soft click sound - ALWAYS plays
  playClick() {
    if (!this.audioContext) return;
    this.resume();
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  // Soft hover sound - ALWAYS plays
  playHover() {
    if (!this.audioContext) return;
    this.resume();
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.03);
    
    gainNode.gain.setValueAtTime(0.025, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.03);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.03);
  }

  // Toggle on sound
  playToggleOn() {
    if (!this.audioContext) return;
    this.resume();
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Toggle off sound
  playToggleOff() {
    if (!this.audioContext) return;
    this.resume();
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Start ambient background music
  startAmbient() {
    if (!this.audioContext || this.isAmbientPlaying) return;
    this.resume();

    // Create master gain for ambient
    const masterGain = this.audioContext.createGain();
    masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 2); // Fade in
    masterGain.connect(this.audioContext.destination);

    // Create multiple layered oscillators for rich ambient texture
    const oscillators = [];
    const gains = [];

    // Base drone - very low
    const createDrone = (freq, type, gainValue, detuneAmount = 0) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      osc.detune.setValueAtTime(detuneAmount, this.audioContext.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
      filter.Q.setValueAtTime(1, this.audioContext.currentTime);
      
      gain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc.start();
      
      oscillators.push(osc);
      gains.push(gain);
      
      return { osc, gain, filter };
    };

    // Create layered ambient sounds
    // Deep bass drone
    createDrone(55, 'sine', 0.4); // A1
    createDrone(55, 'sine', 0.3, 5); // Slightly detuned for richness
    
    // Mid layer
    createDrone(110, 'sine', 0.2); // A2
    createDrone(165, 'sine', 0.1); // E3 (fifth)
    
    // High shimmer
    createDrone(220, 'sine', 0.08); // A3
    createDrone(330, 'sine', 0.05); // E4

    // Add subtle LFO modulation to make it more alive
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, this.audioContext.currentTime); // Very slow
    lfoGain.gain.setValueAtTime(3, this.audioContext.currentTime);
    lfo.connect(lfoGain);
    
    // Connect LFO to modulate the filter frequencies slightly
    oscillators.forEach((osc, i) => {
      if (i > 1) {
        lfoGain.connect(osc.frequency);
      }
    });
    lfo.start();
    oscillators.push(lfo);

    // Store references for stopping later
    this.ambientNodes = {
      masterGain,
      oscillators,
      gains,
    };
    
    this.isAmbientPlaying = true;
  }

  // Stop ambient background music
  stopAmbient() {
    if (!this.audioContext || !this.ambientNodes || !this.isAmbientPlaying) return;

    const { masterGain, oscillators } = this.ambientNodes;
    const now = this.audioContext.currentTime;

    // Fade out
    masterGain.gain.linearRampToValueAtTime(0, now + 1);

    // Stop oscillators after fade
    setTimeout(() => {
      oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      this.ambientNodes = null;
      this.isAmbientPlaying = false;
    }, 1100);
  }
}

export const SoundProvider = ({ children }) => {
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved === 'true'; // Default to OFF
  });
  
  const soundGenerator = useRef(null);

  useEffect(() => {
    soundGenerator.current = new SoundGenerator();
  }, []);

  useEffect(() => {
    localStorage.setItem('musicEnabled', musicEnabled.toString());
  }, [musicEnabled]);

  // Handle ambient music based on state
  useEffect(() => {
    if (soundGenerator.current && soundGenerator.current.initialized) {
      if (musicEnabled) {
        soundGenerator.current.startAmbient();
      } else {
        soundGenerator.current.stopAmbient();
      }
    }
  }, [musicEnabled]);

  const initSound = useCallback(() => {
    if (soundGenerator.current) {
      soundGenerator.current.init();
    }
  }, []);

  const toggleMusic = useCallback(() => {
    initSound();
    setMusicEnabled(prev => {
      const newValue = !prev;
      if (soundGenerator.current && soundGenerator.current.initialized) {
        if (newValue) {
          soundGenerator.current.playToggleOn();
          soundGenerator.current.startAmbient();
        } else {
          soundGenerator.current.playToggleOff();
          soundGenerator.current.stopAmbient();
        }
      }
      return newValue;
    });
  }, [initSound]);

  // Click sound - ALWAYS plays
  const playClick = useCallback(() => {
    if (soundGenerator.current) {
      initSound();
      soundGenerator.current.playClick();
    }
  }, [initSound]);

  // Hover sound - ALWAYS plays
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
