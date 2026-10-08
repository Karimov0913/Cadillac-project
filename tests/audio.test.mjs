// Проверяем автоматику двигателя без запуска реального аудиоустройства в CI.
import test from "node:test";
import assert from "node:assert/strict";
import { EngineAudio } from "../js/audio.js";
function fixture(t) {
  const oldWindow = globalThis.window,
    oldFetch = globalThis.fetch;
  const param = () => ({
    value: 1,
    events: [],
    setValueAtTime(v, time) {
      this.events.push([v, time]);
      this.value = v;
    },
    linearRampToValueAtTime(v, time) {
      this.events.push([v, time]);
      this.value = v;
    },
    setTargetAtTime(v, time) {
      this.events.push([v, time]);
      this.value = v;
    },
    cancelScheduledValues() {},
  });
  const node = () => ({ gain: param(), connect() {}, disconnect() {} });
  class Context {
    constructor() {
      this.currentTime = 0;
      this.destination = {};
      this.state = "running";
    }
    async resume() {}
    async close() {}
    createGain() {
      return node();
    }
    createDynamicsCompressor() {
      const n = node();
      for (const p of ["threshold", "knee", "ratio", "attack", "release"])
        n[p] = param();
      return n;
    }
    createBufferSource() {
      return {
        connect() {},
        disconnect() {},
        start(t) {
          this.startsAt = t;
        },
        stop(t) {
          this.stopsAt = t;
        },
      };
    }
    async decodeAudioData(data) {
      const file = new TextDecoder().decode(data);
      return {
        duration: file.includes("idle")
          ? 3.78
          : file.includes("rev")
            ? 3.15
            : file.includes("shutdown")
              ? 3.25
              : 2.9,
        tag: file,
      };
    }
  }
  globalThis.window = { AudioContext: Context };
  globalThis.fetch = async (url) => ({
    ok: true,
    arrayBuffer: async () => new TextEncoder().encode(String(url)).buffer,
  });
  t.after(() => {
    globalThis.window = oldWindow;
    globalThis.fetch = oldFetch;
  });
  return new EngineAudio();
}
function finish(engine, key) {
  const item = [...engine.sources].find((s) => s.key === key);
  assert.ok(item);
  item.source.onended();
}
test("real ignition is followed by delayed idle, not simultaneous cranking and idle", async (t) => {
  const e = fixture(t);
  assert.equal(await e.start(), true);
  assert.equal(e.state, "starting");
  assert.equal(e.rev(), false);
  const idle = [...e.sources].find((s) => s.key === "idle");
  assert.ok(idle.source.loop);
  assert.ok(idle.source.startsAt > 2.5);
  finish(e, "ignition");
  assert.equal(e.state, "running");
});
test("gas does not stack and becomes available again after its recorded burst", async (t) => {
  const e = fixture(t);
  await e.start();
  finish(e, "ignition");
  assert.equal(e.rev(), true);
  assert.equal(e.rev(), false);
  finish(e, "rev");
  assert.equal(e.revving, false);
  assert.equal(e.rev(), true);
});
test("shutdown cancels gas and reaches off without old callbacks restarting engine", async (t) => {
  const e = fixture(t);
  await e.start();
  finish(e, "ignition");
  e.rev();
  const rev = [...e.sources].find((s) => s.key === "rev");
  assert.equal(e.shutdown(), true);
  assert.equal(e.state, "stopping");
  assert.equal(e.rev(), false);
  assert.equal(e.shutdown(), false);
  rev.source.onended();
  assert.equal(e.state, "stopping");
  finish(e, "shutdown");
  assert.equal(e.state, "off");
  assert.equal(await e.start(), true);
});
test("shutdown can interrupt ignition safely", async (t) => {
  const e = fixture(t);
  await e.start();
  const start = [...e.sources].find((s) => s.key === "ignition");
  e.shutdown();
  start.source.onended();
  assert.equal(e.state, "stopping");
  finish(e, "shutdown");
  assert.equal(e.running, false);
});
test("hiding page stops immediately without playing a shutdown tail", async (t) => {
  const e = fixture(t);
  await e.start();
  e.stop();
  assert.equal(e.state, "off");
  assert.equal(
    [...e.sources].some((s) => s.key === "shutdown"),
    false,
  );
  finish(e, "ignition");
  assert.equal(e.state, "off");
  e.setVolume(10);
  assert.equal(e.volume, 1);
  e.setVolume(-3);
  assert.equal(e.volume, 0);
});
test("pending download cannot start sound after page was hidden", async (t) => {
  const e = fixture(t);
  const pending = e.start();
  e.stop();
  assert.equal(await pending, false);
  assert.equal(e.state, "off");
  assert.equal(e.sources.size, 0);
});
