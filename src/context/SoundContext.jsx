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

  async startAmbient() {
    if (!this.audioContext || this.isAmbientPlaying) return;
    await this.resume();

    // Master gain - medium volume
    const masterGain = this.audioContext.createGain();
    masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.12, this.audioContext.currentTime + 3); // 12% - comfortable level
    masterGain.connect(this.audioContext.destination);

    const oscillators = [];
    const gainNodes = [];

    // Create individual voices with their own gain for swelling effect
    const createVoice = (freq, baseGain, panValue = 0) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      const panner = this.audioContext.createStereoPanner();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, this.audioContext.currentTime);
      filter.Q.setValueAtTime(0.7, this.audioContext.currentTime);
      
      gain.gain.setValueAtTime(baseGain, this.audioContext.currentTime);
      panner.pan.setValueAtTime(panValue, this.audioContext.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(masterGain);
      
      osc.start();
      oscillators.push(osc);
      gainNodes.push(gain);
      
      return { osc, gain, filter };
    };

    // Create a lush Am9 chord spread across stereo field
    // Each note at different pan positions for width
    createVoice(110, 0.5, 0);       // A2 - center (root)
    createVoice(164.81, 0.4, -0.3); // E3 - slight left (fifth)  
    createVoice(196, 0.35, 0.3);    // G3 - slight right (seventh)
    createVoice(261.63, 0.3, -0.5); // C4 - left (minor third)
    createVoice(329.63, 0.25, 0.5); // E4 - right (fifth)
    createVoice(493.88, 0.15, 0);   // B4 - center (ninth)
    
    // Add slightly detuned doubles for chorus/shimmer effect
    createVoice(110.5, 0.2, 0.2);   // Detuned A2
    createVoice(165.5, 0.15, -0.2); // Detuned E3
    createVoice(330.5, 0.1, 0.4);   // Detuned E4

    // Create evolving movement - notes gently swell in and out
    const createSwell = () => {
      const now = this.audioContext.currentTime;
      const swellDuration = 8; // 8 seconds per swell cycle
      
      gainNodes.forEach((gain, i) => {
        const baseValue = gain.gain.value;
        const offset = i * 0.8; // Stagger the swells
        
        // Create continuous swelling pattern
        const scheduleSwells = (startTime) => {
          const swellTime = startTime + offset;
          gain.gain.setValueAtTime(baseValue * 0.6, swellTime);
          gain.gain.linearRampToValueAtTime(baseValue, swellTime + swellDuration / 2);
          gain.gain.linearRampToValueAtTime(baseValue * 0.6, swellTime + swellDuration);
        };
        
        // Schedule initial swells
        for (let t = 0; t < 60; t += swellDuration) {
          scheduleSwells(now + t);
        }
      });
    };

    createSwell();

    // Add a very subtle high shimmer that fades in and out
    const shimmer = this.audioContext.createOscillator();
    const shimmerGain = this.audioContext.createGain();
    const shimmerFilter = this.audioContext.createBiquadFilter();
    
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5
    shimmerFilter.type = 'lowpass';
    shimmerFilter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    shimmerGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    
    shimmer.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    shimmer.start();
    oscillators.push(shimmer);

    // Shimmer fades in and out slowly
    const now = this.audioContext.currentTime;
    for (let t = 0; t < 120; t += 12) {
      shimmerGain.gain.linearRampToValueAtTime(0, now + t);
      shimmerGain.gain.linearRampToValueAtTime(0.08, now + t + 6);
      shimmerGain.gain.linearRampToValueAtTime(0, now + t + 12);
    }

    this.ambientNodes = {
      masterGain,
      oscillators,
      gainNodes,
    };
    
    this.isAmbientPlaying = true;
  }

  stopAmbient() {
    if (!this.audioContext || !this.ambientNodes || !this.isAmbientPlaying) return;

    const { masterGain, oscillators } = this.ambientNodes;
    const now = this.audioContext.currentTime;

    // Cancel scheduled gain changes
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 2);

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
          }, 200);
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
