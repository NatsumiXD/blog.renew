import type { BootSequence } from "./boot";
import { BOOT_BRAND } from "./config";

const SESSION_KEY = "rhine-welcome-entered";
const START = 1.76;
const END = 21.92; // The original welcome/white-out ends here, before the archive scene.
const STATUS_LABELS: Record<string, string> = {
  access: "正在请求访问",
  logo: "莱茵生命",
  auth: "正在验证身份",
  scan: "权限验证通过",
  welcome: `欢迎来到 ${BOOT_BRAND}，即将进入博客`,
};

class RhineWelcome extends HTMLElement {
  private sequence?: BootSequence;
  private controller = new AbortController();
  private resizeObserver?: ResizeObserver;
  private frame = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private startedAt = 0;
  private pausedAt = 0;
  private phase: "waiting" | "playing" | "leaving" | "done" = "waiting";
  private motion = matchMedia("(prefers-reduced-motion: reduce)");

  connectedCallback() {
    if (this.hidden) return;
    // OverlayScrollbars moves body children during initialization, reconnecting
    // this element. Each connection needs fresh event listeners and async work.
    this.controller.abort();
    this.controller = new AbortController();
    const { signal } = this.controller;
    this.addEventListener("rhine:skip", () => this.finish(), { signal });
    this.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        this.finish();
      }
      if (event.key === "Tab") {
        const controls = Array.from(this.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]"))
          .filter((element) => element.getClientRects().length > 0);
        const index = controls.indexOf(document.activeElement as HTMLElement);
        if (controls.length && (event.shiftKey ? index <= 0 : index === controls.length - 1)) {
          event.preventDefault();
          controls[event.shiftKey ? controls.length - 1 : 0].focus();
        }
      }
    }, { signal });
    this.querySelector(".rhine-start")?.addEventListener("click", () => this.start(), { signal });
    this.motion.addEventListener("change", () => {
      if (this.motion.matches && this.phase === "playing") this.showReducedWelcome();
    }, { signal });
    document.addEventListener("visibilitychange", () => {
      if (this.phase !== "playing" || this.motion.matches) return;
      if (document.hidden) {
        this.pausedAt = performance.now();
        cancelAnimationFrame(this.frame);
      } else if (this.pausedAt) {
        this.startedAt += performance.now() - this.pausedAt;
        this.pausedAt = 0;
        this.frame = requestAnimationFrame(this.tick);
      }
    }, { signal });
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this);
    this.resize();
    void this.prepare(signal);
  }

  private resize() {
    const stage = this.querySelector<HTMLElement>(".rhine-stage");
    if (!stage) return;
    const { width, height } = this.getBoundingClientRect();
    // RhineLabUI's opening layout: preserve the central geometry, fill the backdrop.
    const scale = Math.min(Math.max(1, height) / 1080, Math.max(1, width) / 1280);
    stage.style.width = `${width / scale}px`;
    stage.style.height = `${height / scale}px`;
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
    stage.dataset.openingPortrait = String(width / height < 1.05);
    stage.style.setProperty("--opening-scan-scale", String(Math.min(1, width / height)));
  }

  private async prepare(signal: AbortSignal) {
    try {
      const { BootSequence } = await import("./boot");
      if (signal.aborted || !this.isConnected || this.phase !== "waiting") return;
      this.sequence = new BootSequence(this.querySelector<HTMLElement>(".rhine-stage")!);
      this.sequence.update(START);
      // Phrase drawings are local SVGs; only the corner branding needs a webfont.
      await Promise.race([
        Promise.all([
          document.fonts.load('600 19px "Rhine MiSans"', "SYNTHESIZE INFORMATION"),
          document.fonts.load('700 35px "Rhine MiSans"', "ANALYSIS OS"),
        ]).catch(() => {}),
        new Promise<void>((resolve) => { this.timer = setTimeout(resolve, 1500); }),
      ]);
      clearTimeout(this.timer);
      if (signal.aborted || !this.isConnected || this.phase !== "waiting") return;
      const button = this.querySelector<HTMLButtonElement>(".rhine-start")!;
      button.disabled = false;
      button.textContent = "开始连接 →";
      button.focus({ preventScroll: true });
    } catch (error) {
      console.error("RhineLabUI opening unavailable", error);
      this.finish();
    }
  }

  private start() {
    if (this.phase !== "waiting" || !this.sequence) return;
    this.phase = "playing";
    this.dataset.playing = "true";
    this.querySelector<HTMLElement>(".rhine-entry")!.hidden = true;
    this.querySelector<HTMLAnchorElement>(".rhine-skip")?.focus({ preventScroll: true });
    if (this.motion.matches) { this.showReducedWelcome(); return; }
    this.startedAt = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    if (this.phase !== "playing" || !this.isConnected) return;
    const time = Math.min(END, START + (now - this.startedAt) / 1000);
    const motion = this.sequence!.update(time);
    const stage = this.querySelector<HTMLElement>(".rhine-stage")!;
    if (stage.dataset.boot !== motion.step) {
      stage.dataset.boot = motion.step;
      this.querySelector<HTMLElement>(".rhine-status")!.textContent = STATUS_LABELS[motion.step] ?? "";
    }
    if (time >= END) { this.leave(); return; }
    this.frame = requestAnimationFrame(this.tick);
  };

  private showReducedWelcome() {
    cancelAnimationFrame(this.frame);
    this.sequence?.update(20.8);
    this.querySelector<HTMLElement>(".rhine-status")!.textContent = STATUS_LABELS.welcome;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.leave(), 800);
  }

  private leave() {
    if (this.phase !== "playing") return;
    this.phase = "leaving";
    this.dataset.leaving = "true";
    // A short opacity transition bridges the original white-out and the blog.
    this.timer = setTimeout(() => this.finish(), 220);
  }

  private finish() {
    if (this.phase === "done") return;
    this.phase = "done";
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
    document.documentElement.classList.remove("welcome-pending");
    const surface = document.getElementById("blog-surface");
    surface?.removeAttribute("inert");
    this.remove();
    const main = surface?.querySelector("main");
    main?.setAttribute("tabindex", "-1");
    main?.focus({ preventScroll: true });
  }

  disconnectedCallback() {
    this.controller.abort();
    this.resizeObserver?.disconnect();
    cancelAnimationFrame(this.frame);
    clearTimeout(this.timer);
    this.sequence = undefined;
  }
}

if (!customElements.get("rhine-welcome")) customElements.define("rhine-welcome", RhineWelcome);
