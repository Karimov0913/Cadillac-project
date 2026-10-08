// Монтаж трёх выбранных пользователем CC0-записей. Без осцилляторов.
// Запуск Corvette, холостой Grand Marquis, газ Aston + низ Corvette.
const AUDIO_FILES = {
  ignition: "engine-ignition.mp3",
  idle: "engine-idle.mp3",
  rev: "engine-rev.mp3",
  shutdown: "engine-shutdown.mp3",
};
export class EngineAudio {
  constructor({ onStateChange = () => {} } = {}) {
    this.state = "off";
    this.volume = 0.35;
    this.sources = new Set();
    this.revision = 0;
    this.revving = false;
    this.onStateChange = onStateChange;
  }
  get running() {
    return this.state === "starting" || this.state === "running";
  }
  changeState(state) {
    this.state = state;
    this.onStateChange();
  }
  async init() {
    if (!this.context) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) throw new Error("Web Audio unavailable");
      const c = (this.context = new AudioCtx());
      this.master = c.createGain();
      this.master.gain.value = this.volume;
      this.compressor = c.createDynamicsCompressor();
      this.compressor.threshold.value = -12;
      this.compressor.knee.value = 8;
      this.compressor.ratio.value = 2;
      this.compressor.attack.value = 0.012;
      this.compressor.release.value = 0.18;
      this.compressor.connect(this.master);
      this.master.connect(c.destination);
    }
    // Resume вызывается в обработчике жеста, до загрузки файлов (важно для iOS).
    await this.context.resume();
    if (this.buffers) return;
    if (!this.loadingPromise) {
      this.loadingPromise = Promise.all(
        Object.entries(AUDIO_FILES).map(async ([key, file]) => {
          const response = await fetch(
            new URL("../assets/v2/" + file, import.meta.url),
          );
          if (!response.ok) throw new Error("Audio asset unavailable: " + key);
          return [
            key,
            await this.context.decodeAudioData(await response.arrayBuffer()),
          ];
        }),
      )
        .then((entries) => {
          this.buffers = Object.fromEntries(entries);
        })
        .finally(() => {
          this.loadingPromise = null;
        });
    }
    await this.loadingPromise;
  }
  play(
    key,
    {
      when = this.context.currentTime,
      loop = false,
      level = 1,
      fadeIn = 0.035,
      fadeOut = 0.12,
      onEnded,
    } = {},
  ) {
    const c = this.context,
      source = c.createBufferSource(),
      gain = c.createGain();
    source.buffer = this.buffers[key];
    source.loop = loop;
    if (loop) {
      source.loopStart = 0;
      source.loopEnd = source.buffer.duration;
    }
    source.connect(gain);
    gain.connect(this.compressor);
    const duration = source.buffer.duration;
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(level, when + fadeIn);
    if (!loop) {
      gain.gain.setValueAtTime(level, when + duration - fadeOut);
      gain.gain.linearRampToValueAtTime(0, when + duration);
    }
    const item = { source, gain, key, revision: this.revision };
    this.sources.add(item);
    source.onended = () => {
      this.sources.delete(item);
      source.disconnect();
      gain.disconnect();
      if (item.revision === this.revision) onEnded?.();
    };
    source.start(when, 0);
    if (!loop) source.stop(when + duration + 0.015);
    return item;
  }
  async start() {
    if (this.state !== "off" || this.loading) return false;
    const revision = ++this.revision;
    this.loading = true;
    try {
      await this.init();
      if (revision !== this.revision) return false;
      this.changeState("starting");
      const t = this.context.currentTime,
        duration = this.buffers.ignition.duration;
      this.play("ignition", {
        when: t,
        onEnded: () => {
          if (this.state === "starting") this.changeState("running");
        },
      });
      // Холостой ход вступает в конце запуска, а не одновременно со стартером.
      this.idle = this.play("idle", {
        when: t + duration - 0.32,
        loop: true,
        level: 0.9,
        fadeIn: 0.45,
      });
      return true;
    } finally {
      this.loading = false;
    }
  }
  rev() {
    if (this.state !== "running" || this.revving) return false;
    this.revving = true;
    const t = this.context.currentTime,
      duration = this.buffers.rev.duration;
    this.idle.gain.gain.cancelScheduledValues(t);
    this.idle.gain.gain.setTargetAtTime(0.14, t, 0.06);
    this.idle.gain.gain.setTargetAtTime(0.9, t + duration - 0.25, 0.2);
    this.play("rev", {
      onEnded: () => {
        this.revving = false;
        this.onStateChange();
      },
    });
    this.onStateChange();
    return true;
  }
  fadeAll(seconds = 0.16) {
    if (!this.context) return;
    const t = this.context.currentTime;
    for (const item of this.sources) {
      item.gain.gain.cancelScheduledValues(t);
      item.gain.gain.setTargetAtTime(0, t, seconds / 4);
      try {
        item.source.stop(t + seconds);
      } catch {}
    }
    this.idle = null;
    this.revving = false;
  }
  shutdown() {
    if (!this.running) return false;
    ++this.revision;
    this.fadeAll();
    this.changeState("stopping");
    // Отдельный смонтированный спад двигателя: не резкое отключение Gain.
    this.play("shutdown", {
      fadeIn: 0.08,
      onEnded: () => this.changeState("off"),
    });
    return true;
  }
  stop() {
    // Скрытие вкладки/уход со страницы: немедленно гасим всё, без звука выключения.
    ++this.revision;
    this.fadeAll(0.08);
    this.changeState("off");
  }
  setVolume(value) {
    this.volume = Number.isFinite(value)
      ? Math.min(1, Math.max(0, value))
      : 0.35;
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
