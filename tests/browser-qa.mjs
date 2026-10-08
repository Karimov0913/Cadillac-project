// Не входит в npm test: требует локального Playwright и запущенного preview.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("/vercel/sandbox/node_modules/playwright"));
}
import assert from "node:assert/strict";
import fs from "node:fs";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM ||
    (fs.existsSync("/usr/local/bin/chromium")
      ? "/usr/local/bin/chromium"
      : undefined),
  headless: true,
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    "--disable-dev-shm-usage",
  ],
});
const base = process.env.QA_URL || "http://localhost:4174/";
const results = [];
const shots = process.env.QA_SCREENSHOTS || "tests/screenshots";
fs.mkdirSync(shots, { recursive: true });
try {
  for (const width of [1920, 375]) {
    const height = width === 375 ? 812 : 1080;
    const ctx = await browser.newContext({ viewport: { width, height } });
    await ctx.addInitScript(() => {
      const Original = window.AudioContext;
      window.AudioContext = class extends Original {
        constructor(...args) {
          super(...args);
          window.__qaAudio = this;
        }
        async decodeAudioData(...args) {
          const buffer = await super.decodeAudioData(...args);
          window.__qaBuffer = buffer;
          return buffer;
        }
      };
    });
    const p = await ctx.newPage(),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await p.goto(base);
    await p.waitForFunction(
      () => document.documentElement.dataset.viewerReady === "true",
    );
    await p.waitForTimeout(1400);
    assert.equal(
      await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await p.screenshot({ path: `${shots}/hero-${width}.png` });
    await p.locator("[data-studio-mode=spin]").click();
    await p.waitForFunction(() =>
      document.querySelector("#hero-car").src.includes("spin-"),
    );
    await p.locator("#viewer").focus();
    const before = await p.locator("#hero-car").getAttribute("src");
    await p.keyboard.press("ArrowRight");
    assert.notEqual(await p.locator("#hero-car").getAttribute("src"), before);
    await p.locator("[data-studio-mode=interior]").click();
    await p.waitForFunction(() =>
      document
        .querySelector("#viewer-status")
        .textContent.includes("ПАНОРАМА 360"),
    );
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${shots}/panorama-${width}.png` });
    await p.locator("[data-studio-mode=esv]").click();
    const fixedHero = await p.locator("#hero-car").getAttribute("src");
    const storyTop = await p
      .locator("#experience")
      .evaluate((e) => e.getBoundingClientRect().top + scrollY);
    for (let i = 0; i < 5; i++) {
      await p.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        storyTop + height * 4.7 * ((i + 0.65) / 5),
      );
      await p.waitForFunction(() => Math.abs(document.querySelector("#story-stage").getBoundingClientRect().top) < 3);
      await p.waitForFunction(
        (i) =>
          Number(
            getComputedStyle(document.querySelectorAll(".story-scene")[i])
              .opacity,
          ) > 0.98,
        i,
        { timeout: 15000 },
      );
      const top = await p
        .locator("#story-stage")
        .evaluate((e) => e.getBoundingClientRect().top);
      assert.ok(Math.abs(top) < 3, "story pinned at viewport top");
      assert.ok(
        Number(
          await p
            .locator(".story-scene")
            .nth(i)
            .evaluate((e) => getComputedStyle(e).opacity),
        ) > 0.98,
        `correct scene ${i} is readable at ${await p.evaluate(() => scrollY)}, counter ${await p.locator("#story-counter").textContent()}, opacity ${await p
          .locator(".story-scene")
          .nth(i)
          .evaluate((e) => getComputedStyle(e).opacity)}`,
      );
      await p.screenshot({ path: `${shots}/story-${i}-${width}.png` });
    }
    await p.locator("#configuration").evaluate((e) =>
      scrollTo({
        top: e.getBoundingClientRect().top + scrollY,
        behavior: "instant",
      }),
    );
    await p.waitForTimeout(1500);
    await p.locator("[data-paint=red]").click();
    await p.waitForFunction(
      () =>
        document.querySelector("#configuration-image").complete &&
        document.querySelector("#configuration-image").naturalWidth > 0 &&
        document
          .querySelector("#configuration-image")
          .src.includes("paint-red"),
    );
    assert.equal(await p.locator("#hero-car").getAttribute("src"), fixedHero);
    await p.screenshot({ path: `${shots}/config-${width}.png` });
    await p.locator("[data-interior=brown]").click();
    await p.waitForFunction(
      () =>
        document.querySelector("#configuration-image").complete &&
        document
          .querySelector("#configuration-image")
          .src.includes("interior-brown"),
    );
    assert.equal(await p.locator("#hero-car").getAttribute("src"), fixedHero);
    await p.screenshot({ path: `${shots}/interior-${width}.png` });
    await p.locator("#engine-start").click();
    await p.waitForFunction(
      () =>
        document.querySelector("#engine-start").getAttribute("aria-pressed") ===
        "true",
    );
    const audio = await p.evaluate(() => {
      const b = window.__qaBuffer,
        a = b.getChannelData(0),
        r = b.getChannelData(1);
      let energy = 0,
        difference = 0;
      for (let i = 0; i < a.length; i += 100) {
        energy += a[i] * a[i];
        difference += Math.abs(a[i] - r[i]);
      }
      return {
        channels: b.numberOfChannels,
        duration: b.duration,
        energy,
        difference,
        state: window.__qaAudio.state,
      };
    });
    assert.equal(audio.channels, 2);
    assert.ok(audio.energy > 0 && audio.difference > 0);
    assert.equal(audio.state, "running");
    await p.locator("#rev").click();
    await p.waitForTimeout(3250);
    await p.locator("#exhaust").click();
    await p.screenshot({ path: `${shots}/sound-${width}.png` });
    await p.locator("#engine-start").click();
    await p.locator("#craft").evaluate((e) =>
      scrollTo({
        top: e.getBoundingClientRect().top + scrollY,
        behavior: "instant",
      }),
    );
    await p.waitForTimeout(1200);
    await p.locator("#gallery-next").click();
    assert.equal(await p.locator("#gallery-count").textContent(), "02 / 03");
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${shots}/gallery-${width}.png` });
    await p.locator("#fuel-total").scrollIntoViewIfNeeded();
    assert.equal(await p.locator("#fuel-total").textContent(), "$3,508");
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${shots}/fuel-${width}.png` });
    await p.locator("#theme-toggle").evaluate((e) => e.click());
    assert.equal(await p.locator("html").getAttribute("data-theme"), "light");
    await p.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${shots}/light-${width}.png` });
    await p.waitForFunction(() =>
      document
        .querySelector("#offline-state")
        .textContent.includes("OFFLINE-READY"),
    );
    await ctx.setOffline(true);
    await p.reload();
    await p.waitForFunction(
      () => document.documentElement.dataset.viewerReady === "true",
    );
    await p.locator("[data-studio-mode=interior]").click();
    await p.waitForFunction(() =>
      document
        .querySelector("#viewer-status")
        .textContent.includes("ПАНОРАМА 360"),
    );
    assert.equal(errors.length, 0, errors.join("\n"));
    results.push({
      width,
      height,
      errors,
      independentPreview: true,
      pinnedScenes: 5,
      stereoAudio: audio,
      offline: true,
    });
    await ctx.close();
  }
  const ctx = await browser.newContext({
      viewport: { width: 375, height: 812 },
      reducedMotion: "reduce",
    }),
    p = await ctx.newPage();
  await p.goto(base);
  await p.waitForFunction(() =>
    document.querySelector(".experience").classList.contains("no-motion"),
  );
  assert.equal(await p.locator(".story-scene[aria-hidden=false]").count(), 5);
  assert.equal(await p.locator(".pin-spacer").count(), 0);
  results.push({ reducedMotion: true, allScenesReadable: true });
  await ctx.close();
  fs.writeFileSync(
    "tests/qa-results.json",
    JSON.stringify(
      { version: 2, checkedAt: new Date().toISOString(), results },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
