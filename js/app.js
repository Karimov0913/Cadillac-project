// Реальные фотографии, независимое локальное превью, pinned-story и записанный V8.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhotoStudio } from "./configurator.js";
import { EngineAudio } from "./audio.js";
import {
  paints,
  interiors,
  scenes,
  comparison,
  sources,
  dataDisclaimer,
  gallery,
  calculateFuel,
} from "./data.js";
const $ = (id) => document.getElementById(id),
  reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let toastTimer;
function toast(text) {
  $("toast").textContent = text;
  $("toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 3500);
}
function getStored(k) {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function store(k, v) {
  try {
    localStorage.setItem(k, v);
  } catch {}
}
const query = new URLSearchParams(location.search),
  interiorId = query.get("interior") || getStored("v-interior");
const state = {
  paint:
    paints.find((p) => p.id === (query.get("paint") || getStored("v-paint"))) ||
    paints[0],
  interior:
    interiors.find(
      (p) => p.id === (interiorId === "beige" ? "gray" : interiorId),
    ) || interiors[0],
};
let previewMode = "exterior";
const studio = new PhotoStudio($("viewer"), {
  onStatus: (message) => ($("viewer-status").textContent = message),
});
studio.init();
document
  .querySelectorAll("[data-studio-mode]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      studio.setMode(button.dataset.studioMode),
    ),
  );
$("rotation-toggle").addEventListener("click", () => {
  const active = studio.toggleRotation();
  $("rotation-toggle").setAttribute("aria-pressed", String(active));
  toast(
    reduced
      ? "Автовращение отключено настройкой уменьшения движения"
      : active
        ? "Автовращение V / 360° включено"
        : "Автовращение приостановлено",
  );
});
// Конфигуратор не изменяет главный viewer: никаких походов наверх.
function updatePreview() {
  const interior = previewMode === "interior",
    item = interior ? state.interior : state.paint;
  $("configuration-image").src = new URL(
    "../assets/v2/" + item.image,
    import.meta.url,
  ).href;
  $("configuration-image").alt = interior
    ? `Настоящий интерьер Cadillac ${item.name}`
    : `Заводское изображение Escalade-V: ${item.name}`;
  $("configuration-name").textContent = item.name;
  $("configuration-note").textContent = interior
    ? item.note
    : item.id === "blue"
      ? "Кастомный цветовой эскиз · не заводская опция"
      : "Заводское изображение V-Series · стандартная база";
  $("config-preview").classList.toggle("interior", interior);
  $("config-preview").dataset.preview = previewMode;
  document
    .querySelectorAll("[data-preview-mode]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.previewMode === previewMode),
      ),
    );
}
function select(type, item, { switchView = true } = {}) {
  state[type] = item;
  store("v-" + type, item.id);
  document
    .querySelectorAll(`[data-${type}]`)
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset[type] === item.id),
      ),
    );
  if (type === "paint") {
    $("paint-name").textContent = item.name;
    $("paint-code").textContent = item.finish;
  } else {
    $("interior-name").textContent = item.name;
    $("interior-note").textContent = item.note;
  }
  if (switchView) previewMode = type === "paint" ? "exterior" : "interior";
  updatePreview();
}
for (const [type, items, id] of [
  ["paint", paints, "paint-swatches"],
  ["interior", interiors, "interior-swatches"],
])
  for (const item of items) {
    const button = document.createElement("button");
    button.className = "swatch";
    button.dataset[type] = item.id;
    button.title = item.name;
    button.style.setProperty("--swatch", item.hex);
    button.setAttribute("aria-label", item.name);
    button.setAttribute("aria-pressed", String(state[type].id === item.id));
    button.innerHTML = '<span aria-hidden="true"></span>';
    button.addEventListener("click", () => select(type, item));
    $(id).append(button);
  }
select("paint", state.paint, { switchView: false });
select("interior", state.interior, { switchView: false });
document.querySelectorAll("[data-preview-mode]").forEach((button) =>
  button.addEventListener("click", () => {
    previewMode = button.dataset.previewMode;
    updatePreview();
  }),
);
// Пять полноэкранных сцен. Закрепляется весь экран, контент двигается внутри него.
for (const [i, item] of scenes.entries()) {
  const scene = document.createElement("article");
  scene.className = "story-scene";
  scene.dataset.scene = item.id;
  scene.setAttribute("aria-label", item.title);
  scene.setAttribute("aria-hidden", String(i !== 0));
  const visual = document.createElement("div");
  visual.className = "story-visual";
  const img = new Image();
  img.className = "story-image";
  img.src = new URL("../assets/v2/" + item.image, import.meta.url).href;
  img.alt = item.alt;
  img.width = 1800;
  img.height = 1200;
  visual.append(img);
  const text = document.createElement("div");
  text.className = "story-text";
  const motion = document.createElement("div");
  motion.className = "story-copy-motion";
  const label = document.createElement("span");
  label.className = "eyebrow";
  label.textContent = item.label;
  const value = document.createElement("div");
  value.className = "story-value";
  value.append(document.createTextNode(item.value));
  if (item.unit) {
    const unit = document.createElement("span");
    unit.textContent = item.unit;
    value.append(unit);
  }
  const title = document.createElement("h2");
  title.textContent = item.title;
  const description = document.createElement("p");
  description.textContent = item.text;
  const note = document.createElement("small");
  note.textContent = item.note;
  motion.append(label, value, title, description, note);
  text.append(motion);
  scene.append(visual, text);
  $("story-scenes").append(scene);
}
gsap.registerPlugin(ScrollTrigger);
const media = gsap.matchMedia();
media.add("(prefers-reduced-motion: no-preference)", () => {
  const panels = gsap.utils.toArray(".story-scene");
  const timeline = gsap.timeline({
    // Счётчик следует видимой сцене, а не опережает её при быстром скролле.
    onUpdate() {
      let active = 0,
        opacity = -1;
      panels.forEach((panel, i) => {
        const value = Number(gsap.getProperty(panel, "opacity"));
        if (value > opacity) {
          opacity = value;
          active = i;
        }
      });
      $("story-counter").textContent =
        String(active + 1).padStart(2, "0") + " / 05";
      $("story-stage").dataset.sceneIndex = String(active);
      panels.forEach((panel, i) =>
        panel.setAttribute("aria-hidden", String(i !== active)),
      );
    },
    scrollTrigger: {
      id: "v-experience",
      trigger: "#experience",
      start: "top top",
      end: () => "+=" + innerHeight * 4.7,
      pin: "#story-stage",
      scrub: 1.1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        $("story-progress-bar").style.transform =
          `scaleX(${0.2 + self.progress * 0.8})`;
      },
    },
  });
  timeline.to({}, { duration: 0.65 });
  for (let i = 1; i < panels.length; i++) {
    const at = i * 1.5;
    const previous = panels[i - 1],
      next = panels[i];
    timeline
      .to(previous, { autoAlpha: 0, duration: 0.55, ease: "none" }, at)
      .fromTo(
        next,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.55, ease: "none" },
        at,
      )
      .to(
        previous.querySelector(".story-copy-motion"),
        {
          y: -85,
          autoAlpha: 0,
          filter: "blur(5px)",
          duration: 0.55,
          ease: "power1.inOut",
        },
        at,
      )
      .fromTo(
        next.querySelector(".story-copy-motion"),
        { y: 95, autoAlpha: 0, filter: "blur(6px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
        },
        at + 0.06,
      )
      .to(
        previous.querySelector(".story-image"),
        {
          scale: 1.08,
          xPercent: -3,
          filter: "blur(9px)",
          duration: 0.65,
          ease: "power1.inOut",
        },
        at,
      )
      .fromTo(
        next.querySelector(".story-image"),
        { scale: 1.16, xPercent: 5, yPercent: 2, filter: "blur(14px)" },
        {
          scale: 1,
          xPercent: 0,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
        },
        at,
      );
  }
  timeline.to({}, { duration: 0.64 }, 6.86);
  gsap.from(".hero-copy", {
    y: 18,
    autoAlpha: 0,
    duration: 1.1,
    ease: "power2.out",
  });
  gsap.utils.toArray(".reveal").forEach((el) =>
    gsap.from(el, {
      y: 25,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 94%", once: true },
    }),
  );
  return () => timeline.kill();
});
media.add("(prefers-reduced-motion: reduce)", () => {
  document.querySelector(".experience").classList.add("no-motion");
  document
    .querySelectorAll(".story-scene")
    .forEach((panel) => panel.setAttribute("aria-hidden", "false"));
  return () =>
    document.querySelector(".experience").classList.remove("no-motion");
});
// Таблица и заметки сохраняют различия в годах и методиках.
for (const row of comparison) {
  const tr = document.createElement("tr"),
    label = document.createElement("th");
  label.scope = "row";
  label.textContent = row.label;
  tr.append(label);
  for (const [index, value] of row.values.entries()) {
    const td = document.createElement("td"),
      span = document.createElement("span");
    span.textContent = value;
    if (row.em) span.className = "value-em";
    td.append(span);
    if (row.notes) {
      const small = document.createElement("small");
      small.textContent = row.notes[index];
      td.append(small);
    }
    tr.append(td);
  }
  $("comparison-body").append(tr);
}
for (const source of sources) {
  const p = document.createElement("p"),
    a = document.createElement("a");
  a.href = source.url;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = source.label + " ↗";
  p.append(a, document.createTextNode(" — " + source.note));
  $("source-notes").append(p);
}
const dataNote = document.createElement("p");
dataNote.textContent = dataDisclaimer;
$("source-notes").append(dataNote);
// Записанный V8 — без осцилляторов, с сохранением стереоканалов.
const engine = new EngineAudio();
for (let i = 0; i < 40; i++) {
  const bar = document.createElement("i");
  bar.style.setProperty("--h", `${5 + Math.sin(i * 0.67) ** 2 * 23}px`);
  bar.style.setProperty("--delay", `${-i * 0.13}s`);
  document.querySelector(".equalizer").append(bar);
}
function audioUI() {
  const on = engine.running;
  $("engine-start").setAttribute("aria-pressed", String(on));
  $("engine-label").textContent = on ? "Выключить V8" : "Включить V8";
  $("sound-status").textContent = on ? "BINAURAL / LIVE" : "OFF";
  $("rev").disabled = !on;
  $("exhaust").disabled = !on;
  document.querySelector(".sound-panel").classList.toggle("running", on);
}
let starting = false;
$("engine-start").addEventListener("click", async () => {
  if (starting) return;
  starting = true;
  try {
    if (engine.running) engine.stop();
    else {
      await engine.start();
      studio.shake();
    }
    audioUI();
  } catch {
    toast(
      "Не удалось загрузить запись V8. Проверьте подключение или обновите страницу.",
    );
  } finally {
    starting = false;
  }
});
$("rev").addEventListener("click", () => {
  if (engine.rev()) studio.shake();
});
$("exhaust").addEventListener("click", () => {
  if (engine.exhaust()) studio.shake();
});
$("volume").addEventListener("input", (e) => {
  engine.setVolume(Number(e.target.value) / 100);
  $("volume-value").textContent = e.target.value + "%";
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && engine.running) {
    engine.stop();
    audioUI();
  }
});
window.addEventListener("pagehide", () => engine.stop());
// Тема не перекрашивает и не инвертирует реальные фотографии.
function themeLabel() {
  const light = document.documentElement.dataset.theme === "light";
  $("theme-toggle").setAttribute(
    "aria-label",
    light ? "Включить тёмную тему" : "Включить светлую тему",
  );
  document.querySelector('meta[name="theme-color"]').content = light
    ? "#f0f2f5"
    : "#101119";
}
themeLabel();
$("theme-toggle").addEventListener("click", () => {
  document.documentElement.dataset.theme =
    document.documentElement.dataset.theme === "light" ? "dark" : "light";
  store("v-theme", document.documentElement.dataset.theme);
  themeLabel();
});
async function share() {
  const url = new URL(location.href);
  url.searchParams.set("paint", state.paint.id);
  url.searchParams.set("interior", state.interior.id);
  url.hash = "configuration";
  try {
    await navigator.clipboard.writeText(url.href);
    toast("Ссылка на вашу конфигурацию скопирована");
  } catch {
    const field = document.createElement("textarea");
    field.value = url.href;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) history.replaceState(null, "", url);
    toast(
      copied
        ? "Ссылка на вашу конфигурацию скопирована"
        : "Конфигурация записана в адресную строку — скопируйте ссылку",
    );
  }
}
$("share").addEventListener("click", share);
$("share-bottom").addEventListener("click", share);
let galleryIndex = 0;
function showPhoto(index) {
  galleryIndex = (index + gallery.length) % gallery.length;
  const item = gallery[galleryIndex];
  $("gallery-image").src = new URL(
    "../assets/v2/" + item.file,
    import.meta.url,
  ).href;
  $("gallery-image").alt = item.alt;
  $("gallery-title").textContent = item.title;
  $("gallery-description").textContent = item.description;
  $("gallery-count").textContent =
    String(galleryIndex + 1).padStart(2, "0") + " / 03";
}
$("gallery-prev").addEventListener("click", () => showPhoto(galleryIndex - 1));
$("gallery-next").addEventListener("click", () => showPhoto(galleryIndex + 1));
let touchX;
document.querySelector(".gallery").addEventListener(
  "touchstart",
  (e) => {
    touchX = e.changedTouches[0].screenX;
  },
  { passive: true },
);
document.querySelector(".gallery").addEventListener(
  "touchend",
  (e) => {
    const delta = e.changedTouches[0].screenX - touchX;
    if (Math.abs(delta) > 60) showPhoto(galleryIndex + (delta < 0 ? 1 : -1));
  },
  { passive: true },
);
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
function updateFuel() {
  const km = Number($("annual-distance").value),
    price = Number($("fuel-price").value),
    city = Number($("city-share").value);
  $("city-share-value").textContent = city + "%";
  if (!$("fuel-form").checkValidity()) {
    $("fuel-total").textContent = "—";
    $("fuel-details").textContent =
      "Введите корректные неотрицательные значения";
    return;
  }
  const highway = $("efficiency-profile").value === "brief" ? 17 : 16,
    result = calculateFuel(km, price, city, highway);
  $("fuel-total").textContent = money.format(result.cost);
  $("fuel-details").textContent =
    `${Math.round(result.litres).toLocaleString("ru-RU")} л / год · ${result.l100.toFixed(1)} л / 100 км`;
  document.querySelector(".formula-note").textContent =
    `Город × 235,215/11 + трасса × 235,215/${highway} л/100 км. Расход взвешен по расстоянию, не усреднён в mpg.`;
}
$("fuel-form").addEventListener("input", updateFuel);
$("fuel-form").addEventListener("change", updateFuel);
$("fuel-form").addEventListener("submit", (e) => e.preventDefault());
updateFuel();
if (!reduced && matchMedia("(pointer:fine)").matches) {
  const dot = document.querySelector(".cursor-dot"),
    trail = document.querySelector(".cursor-trail"),
    xTo = gsap.quickTo(trail, "x", { duration: 0.35 }),
    yTo = gsap.quickTo(trail, "y", { duration: 0.35 });
  window.addEventListener("pointermove", (e) => {
    dot.style.opacity = "1";
    trail.style.opacity = "1";
    gsap.set(dot, { x: e.clientX - 2, y: e.clientY - 2 });
    xTo(e.clientX - 12);
    yTo(e.clientY - 12);
  });
  document.addEventListener("pointerleave", () => {
    dot.style.opacity = "0";
    trail.style.opacity = "0";
  });
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(new URL("../sw.js", import.meta.url), {
      scope: new URL("../", import.meta.url).pathname,
    })
    .then(async (registration) => {
      await navigator.serviceWorker.ready;
      (registration.active || navigator.serviceWorker.controller)?.postMessage({
        type: "STATUS",
      });
    })
    .catch(() => ($("offline-state").textContent = "ОФЛАЙН-КЭШ НЕДОСТУПЕН"));
  navigator.serviceWorker.addEventListener("message", (e) => {
    if (e.data?.type === "CACHE_READY")
      $("offline-state").textContent =
        "OFFLINE-READY / ИЗОБРАЖЕНИЯ И V8 СОХРАНЕНЫ";
  });
} else $("offline-state").textContent = "SERVICE WORKER НЕ ПОДДЕРЖИВАЕТСЯ";
