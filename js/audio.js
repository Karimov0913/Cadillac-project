// Настоящий записанный V8: binaural stereo / CC0. Осцилляторов нет.
// Источник overmedium/Freesound 651534. Автомобиль автору записи неизвестен.
export class EngineAudio {
  constructor() {
    this.running = false;
    this.volume = 0.35;
    this.sources = new Set();
    this.effectUntil = 0;
  }
  async init() {
    if (this.context && this.buffer) {
      await this.context.resume();
      return;
    }
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) throw new Error("Web Audio unavailable");
    this.context = new AudioCtx();
    const c = this.context;
    this.master = c.createGain();
    this.master.gain.value = this.volume;
    this.compressor = c.createDynamicsCompressor();
    this.compressor.threshold.value = -10;
    this.compressor.knee.value = 12;
    this.compressor.ratio.value = 3;
    this.compressor.attack.value = 0.008;
    this.compressor.release.value = 0.18;
    this.bass = c.createBiquadFilter();
    this.bass.type = "lowshelf";
    this.bass.frequency.value = 150;
    this.bass.gain.value = 2;
    this.bass.connect(this.compressor);
    this.compressor.connect(this.master);
    this.master.connect(c.destination);
    const response = await fetch(
      new URL("../assets/v2/v8-binaural.mp3", import.meta.url),
    );
    if (!response.ok) throw new Error("Audio asset unavailable");
    this.buffer = await c.decodeAudioData(await response.arrayBuffer());
    await c.resume();
  }
  play(offset, duration, { loop = false, level = 1, fade = 0.06 } = {}) {
    const c = this.context,
      source = c.createBufferSource(),
      gain = c.createGain();
    source.buffer = this.buffer;
    source.loop = loop;
    if (loop) {
      source.loopStart = offset;
      source.loopEnd = offset + duration;
    }
    source.connect(gain);
    gain.connect(this.bass);
    const t = c.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(level, t + fade);
    source.start(t, offset);
    if (!loop) {
      gain.gain.setValueAtTime(level, t + duration - 0.13);
      gain.gain.linearRampToValueAtTime(0, t + duration);
      source.stop(t + duration + 0.02);
    }
    source.onended = () => {
      this.sources.delete(item);
      source.disconnect();
      gain.disconnect();
    };
    const item = { source, gain };
    this.sources.add(item);
    return item;
  }
  async start() {
    await this.init();
    if (this.running) return;
    this.running = true;
    this.play(0.25, 1.45, { level: 0.7 });
    this.idle = this.play(5.55, 1.9, { loop: true, level: 0.42, fade: 0.5 });
  }
  stop() {
    if (!this.context) return;
    this.running = false;
    this.effectUntil = 0;
    const t = this.context.currentTime;
    for (const item of this.sources) {
      item.gain.gain.cancelScheduledValues(t);
      item.gain.gain.setTargetAtTime(0, t, 0.06);
      try {
        item.source.stop(t + 0.25);
      } catch {}
    }
    this.idle = null;
  }
  duckIdle(duration) {
    if (!this.idle) return;
    const t = this.context.currentTime;
    this.idle.gain.gain.cancelScheduledValues(t);
    this.idle.gain.gain.setTargetAtTime(0.07, t, 0.04);
    this.idle.gain.gain.setTargetAtTime(0.42, t + duration, 0.18);
  }
  rev() {
    if (!this.running || performance.now() < this.effectUntil) return false;
    this.effectUntil = performance.now() + 3150;
    this.duckIdle(2.8);
    this.play(1.8, 3.15, { level: 0.85 });
    return true;
  }
  exhaust() {
    if (!this.running || performance.now() < this.effectUntil) return false;
    this.effectUntil = performance.now() + 3000;
    this.duckIdle(2.7);
    this.play(3.85, 3, { level: 0.95 });
    return true;
  }
  setVolume(value) {
    this.volume = Math.min(1, Math.max(0, value));
    this.master?.gain.setTargetAtTime(
      this.volume,
      this.context.currentTime,
      0.07,
    );
  }
  async dispose() {
    this.stop();
    await this.context?.close();
  }
}
