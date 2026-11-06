/**
 * Synthesizes pure Web Audio sound effects and ambient soundscapes.
 * No external audio files required, resilient and instant.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGainNode: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private isAmbientPlaying: boolean = false;
  private currentTrack: string = 'Ethereal Glass';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGainNode && this.ctx) {
      this.ambientGainNode.gain.setValueAtTime(muted ? 0 : 0.12, this.ctx.currentTime);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Soft tactile click
  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Window opening whoosh chime
  public playWindowOpen() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Two harmonic sines with gentle envelope
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.03);

        gain.gain.setValueAtTime(0.04, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35 + i * 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.03);
        osc.stop(now + 0.4 + i * 0.03);
      });
    } catch {}
  }

  // Window minimize/close swoosh
  public playWindowClose() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // Glass notification bell
  public playNotification() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } catch {}
  }

  // Procedural Ambient Flow
  public startAmbient(trackName: string = 'Ethereal Glass') {
    this.stopAmbient();
    const ctx = this.initCtx();
    if (!ctx) return;

    this.currentTrack = trackName;
    this.isAmbientPlaying = true;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.ambientGainNode = masterGain;

    // Define harmonic chords per track
    let chordFreqs = [220, 277.18, 329.63, 440]; // A major
    if (trackName === 'Deep Water') {
      chordFreqs = [146.83, 174.61, 220.00, 293.66]; // D minor
    } else if (trackName === 'Aurora Drone') {
      chordFreqs = [196.00, 246.94, 293.66, 392.00]; // G major
    } else if (trackName === 'Lo-Fi Warmth') {
      chordFreqs = [261.63, 329.63, 392.00, 493.88]; // C maj7
    }

    this.ambientOscillators = [];

    // Filter to give warm, buttery, analog liquid resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(2.0, ctx.currentTime);
    filter.connect(masterGain);

    // Slowly modulate filter cutoff for breathing liquid effect
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // very slow cycle
    lfoGain.gain.setValueAtTime(150, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.ambientOscillators.push(lfo);

    chordFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Subtle detune for shimmer
      osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);

      oscGain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start();
      this.ambientOscillators.push(osc);
    });
  }

  public stopAmbient() {
    this.ambientOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.ambientOscillators = [];
    if (this.ambientGainNode) {
      try {
        this.ambientGainNode.disconnect();
      } catch {}
      this.ambientGainNode = null;
    }
    this.isAmbientPlaying = false;
  }

  public toggleAmbient(trackName?: string) {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
    } else {
      this.startAmbient(trackName || this.currentTrack);
    }
    return this.isAmbientPlaying;
  }

  public isPlayingAmbient(): boolean {
    return this.isAmbientPlaying;
  }

  public getCurrentTrack(): string {
    return this.currentTrack;
  }

  public getAudioContext(): AudioContext | null {
    return this.initCtx();
  }
}

export const sound = new SoundEngine();
