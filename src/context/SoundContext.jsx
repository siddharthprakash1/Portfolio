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

  // Resume audio context if suspended (needed for browsers)
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (e) {
        console.warn('Could not resume audio context');
      }
    }
  }

  // Soft click sound - ALWAYS plays
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

  // Soft hover sound - ALWAYS plays
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

  // Toggle on sound
  async playToggleOn() {
    if (!this.audioContext) return;
    await this.resume();
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Toggle off sound
  async playToggleOff() {
    if (!this.audioContext) return;
    await this.resume();
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Start ambient background music
  async startAmbient() {
    if (!this.audioContext || this.isAmbientPlaying) return;
    await this.resume();

    console.log('Starting ambient music...');

    // Create master gain for ambient - MUCH LOUDER now
    const masterGain = this.audioContext.createGain();
    masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.25, this.audioContext.currentTime + 2); // Fade in to 25%
    masterGain.connect(this.audioContext.destination);

    const oscillators = [];

    // Create a warm pad sound
    const createPad = (freq, gainValue) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      
      // Warm lowpass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.audioContext.currentTime);
      filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);
      
      gain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc.start();
      oscillators.push(osc);
      
      return { osc, gain, filter };
    };

    // Create a rich ambient chord (Am7 voicing)
    createPad(110, 0.5);    // A2 - root
    createPad(164.81, 0.4); // E3 - fifth
    createPad(220, 0.35);   // A3 - octave
    createPad(261.63, 0.3); // C4 - minor third
    createPad(329.63, 0.25); // E4 - fifth
    createPad(392, 0.15);   // G4 - seventh

    // Add subtle detuned layer for richness
    const osc2 = this.audioContext.createOscillator();
    const gain2 = this.audioContext.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110, this.audioContext.currentTime);
    osc2.detune.setValueAtTime(8, this.audioContext.currentTime); // Slightly detuned
    gain2.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start();
    oscillators.push(osc2);

    // Add very slow LFO for gentle movement
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.05, this.audioContext.currentTime); // Very slow - 1 cycle per 20 seconds
    lfoGain.gain.setValueAtTime(0.03, this.audioContext.currentTime); // Subtle volume variation
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start();
    oscillators.push(lfo);

    // Store references for stopping later
    this.ambientNodes = {
      masterGain,
      oscillators,
    };
    
    this.isAmbientPlaying = true;
    console.log('Ambient music started!');
  }

  // Stop ambient background music
  stopAmbient() {
    if (!this.audioContext || !this.ambientNodes || !this.isAmbientPlaying) return;

    console.log('Stopping ambient music...');

    const { masterGain, oscillators } = this.ambientNodes;
    const now = this.audioContext.currentTime;

    // Fade out over 1.5 seconds
    masterGain.gain.linearRampToValueAtTime(0, now + 1.5);

    // Stop oscillators after fade
    setTimeout(() => {
      oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {
          // Already stopped
        }
      });
      this.ambientNodes = null;
      this.isAmbientPlaying = false;
      console.log('Ambient music stopped!');
    }, 1600);
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
          // Small delay to let toggle sound play first
          setTimeout(() => {
            soundGenerator.current.startAmbient();
          }, 200);
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
