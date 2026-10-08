// Внешний вид — реальные заводские изображения. Никакой процедурной машины.
import { gsap } from "gsap";
export class PhotoStudio {
  constructor(element, { onStatus }) {
    this.element = element;
    this.image = element.querySelector("img");
    this.onStatus = onStatus;
    this.mode = "esv";
    this.frame = 0;
    this.zoom = 1;
    this.lastInteraction = performance.now();
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.frames = [];
    this.auto = true;
    this.ready = false;
    this.dragging = false;
    this.disposed = false;
    this.panorama = null;
  }
  async init() {
    const load = (src) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    try {
      await this.image.decode();
      this.ready = true;
      document.documentElement.dataset.viewerReady = "true";
      this.onStatus("ESV · ЗАВОДСКОЕ ИЗОБРАЖЕНИЕ");
    } catch {
      this.onStatus("ИЗОБРАЖЕНИЕ НЕ ЗАГРУЗИЛОСЬ");
    }
    this.framesPromise = Promise.all(
      Array.from({ length: 16 }, (_, i) =>
        load(
          new URL(
            `../assets/v2/spin-${String(i + 1).padStart(2, "0")}.webp`,
            import.meta.url,
          ).href,
        ),
      ),
    )
      .then((images) => {
        this.frames = images;
        return images;
      })
      .catch(() => {
        this.onStatus("360° НЕДОСТУПНО · ESV ДОСТУПЕН");
        return [];
      });
    this.element.addEventListener("pointerdown", (e) => {
      if (this.mode !== "spin") return;
      this.dragging = true;
      this.startX = e.clientX;
      this.startFrame = this.frame;
      this.element.setPointerCapture(e.pointerId);
      this.interact();
    });
    this.element.addEventListener("pointermove", (e) => {
      if (this.dragging) {
        const delta = e.clientX - this.startX;
        this.showFrame(
          Math.round(
            this.startFrame -
              delta / Math.max(14, this.element.clientWidth / 45),
          ),
        );
        this.interact();
      } else if (
        this.mode === "esv" &&
        e.pointerType !== "touch" &&
        !this.reduced
      ) {
        const r = this.element.getBoundingClientRect();
        gsap.to(this.image, {
          x: ((e.clientX - r.left) / r.width - 0.5) * 18,
          y: ((e.clientY - r.top) / r.height - 0.5) * 9,
          duration: 0.8,
          overwrite: "auto",
        });
      }
    });
    this.element.addEventListener("pointerup", () => {
      this.dragging = false;
      this.interact();
    });
    this.element.addEventListener("pointercancel", () => {
      this.dragging = false;
      this.interact();
    });
    this.element.addEventListener(
      "wheel",
      (e) => {
        if (this.mode === "interior") return;
        if (!e.ctrlKey) return;
        e.preventDefault();
        this.zoom = Math.max(1, Math.min(1.7, this.zoom - e.deltaY * 0.002));
        gsap.to(this.image, { scale: this.zoom, duration: 0.3 });
        this.interact();
      },
      { passive: false },
    );
    this.element.addEventListener("keydown", (e) => {
      if (this.mode === "spin" && ["ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        this.showFrame(this.frame + (e.key === "ArrowRight" ? 1 : -1));
        this.interact();
      }
      if (["+", "-"].includes(e.key)) {
        e.preventDefault();
        this.zoom = Math.max(
          1,
          Math.min(1.7, this.zoom + (e.key === "+" ? 0.1 : -0.1)),
        );
        gsap.to(this.image, { scale: this.zoom, duration: 0.2 });
      }
    });
    this.timer = setInterval(() => {
      if (
        this.mode === "spin" &&
        this.auto &&
        !this.reduced &&
        !document.hidden &&
        !this.dragging &&
        performance.now() - this.lastInteraction > 5000
      ) {
        const rect = this.element.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < innerHeight)
          this.showFrame(this.frame + 1);
      }
    }, 350);
  }
  interact() {
    this.lastInteraction = performance.now();
  }
  showFrame(index) {
    if (!this.frames.length) return;
    this.frame = (index + this.frames.length) % this.frames.length;
    this.image.src = this.frames[this.frame].src;
    this.image.alt = `Заводской кадр Escalade-V ${this.frame + 1} из 16, стандартная база`;
    this.onStatus(
      `V-SERIES · 360° · ${String(this.frame + 1).padStart(2, "0")} / 16`,
    );
  }
  async setMode(mode) {
    this.interact();
    this.mode = mode;
    this.zoom = 1;
    gsap.set(this.image, { x: 0, y: 0, scale: 1 });
    this.panorama?.dispose();
    this.panorama = null;
    const pano = document.getElementById("panorama");
    pano.hidden = mode !== "interior";
    this.image.hidden = mode === "interior";
    document
      .querySelectorAll("[data-studio-mode]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.studioMode === mode),
        ),
      );
    if (mode === "esv") {
      this.image.src = new URL(
        "../assets/v2/esv-hero.webp",
        import.meta.url,
      ).href;
      this.image.alt =
        "Cadillac Escalade-V ESV, официальное изображение длиннобазной версии";
      this.onStatus("ESV · ЗАВОДСКОЕ ИЗОБРАЖЕНИЕ");
    }
    if (mode === "spin") {
      this.onStatus("ЗАГРУЖАЕМ ЗАВОДСКИЕ КАДРЫ…");
      await this.framesPromise;
      if (this.mode === "spin") this.showFrame(0);
    }
    if (mode === "interior") {
      this.onStatus("ЗАГРУЖАЕМ ПАНОРАМУ САЛОНА…");
      try {
        const { createPanorama } = await import("./panorama.js");
        const viewer = await createPanorama(pano, "black");
        if (this.mode !== "interior") {
          viewer.dispose();
          return;
        }
        this.panorama = viewer;
        this.onStatus("САЛОН V-SERIES · ПАНОРАМА 360°");
      } catch {
        if (this.mode !== "interior") return;
        pano.hidden = true;
        this.image.hidden = false;
        this.image.src = new URL(
          "../assets/v2/pano-black-f.webp",
          import.meta.url,
        ).href;
        this.image.alt = "Фотография салона Escalade-V";
        this.onStatus("САЛОН · 2D · WEBGL НЕДОСТУПЕН");
      }
    }
  }
  toggleRotation() {
    this.auto = !this.auto;
    this.lastInteraction = this.auto ? 0 : performance.now();
    return this.auto;
  }
  shake() {
    if (this.reduced) return;
    gsap.fromTo(
      this.element,
      { x: -1.2 },
      { x: 0, duration: 0.07, repeat: 5, yoyo: true, clearProps: "x" },
    );
  }
  dispose() {
    this.disposed = true;
    clearInterval(this.timer);
    this.panorama?.dispose();
  }
}
