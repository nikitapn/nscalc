import type { SiteEventIntensity } from "../adminEvents";

type PetalsLaunchOptions = {
  durationSeconds: number;
  intensity: SiteEventIntensity;
  onFinish?: () => void;
};

type PetalsOverlayController = {
  stop(): void;
};

type Petal = {
  x: number;
  y: number;
  /** half-width of the ellipse */
  rx: number;
  /** half-height of the ellipse */
  ry: number;
  vy: number;
  drift: number;
  wobble: number;
  spin: number;
  angle: number;
  alpha: number;
  /** 0–1 position in the pink-to-white palette */
  hue: number;
};

// Soft sakura palette: blush pink → pale pink → near-white
const PETAL_COLORS: [number, number, number][] = [
  [255, 183, 197], // #FFB7C5 — classic sakura pink
  [255, 204, 213], // #FFCCD5 — lighter blush
  [255, 220, 228], // #FFDCE4 — very pale pink
  [255, 235, 238], // #FFEBEE — almost white
];

function petalColor(hue: number, alpha: number): string {
  const index = Math.min(Math.floor(hue * PETAL_COLORS.length), PETAL_COLORS.length - 1);
  const [r, g, b] = PETAL_COLORS[index];
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function launchPetalsOverlay(options: PetalsLaunchOptions): PetalsOverlayController {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.zIndex = "95";
  canvas.style.pointerEvents = "none";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.opacity = "0";
  canvas.style.transition = "opacity 260ms ease";
  document.body.append(canvas);

  const rawContext = canvas.getContext("2d");
  if (!rawContext) {
    canvas.remove();
    throw new Error("2D canvas is not available for petals.");
  }
  const context = rawContext;

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const intensity = reducedMotion ? "gentle" : options.intensity;
  const targetCount = intensity === "showtime" ? 140 : 70;
  const durationSeconds = Math.max(6, options.durationSeconds);
  const petals: Petal[] = [];
  let width = 0;
  let height = 0;
  let destroyed = false;
  let animationFrame = 0;
  let elapsed = 0;
  let lastTimestamp = performance.now();

  function resize(): void {
    const ratio = window.devicePixelRatio || 1;
    width = Math.max(window.innerWidth, 1);
    height = Math.max(window.innerHeight, 1);
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createPetal(resetAboveViewport = false): Petal {
    const rx = intensity === "showtime" ? randomBetween(4, 10) : randomBetween(3, 8);
    return {
      x: Math.random() * width,
      y: resetAboveViewport ? -Math.random() * height * 0.25 : Math.random() * height,
      rx,
      ry: rx * randomBetween(0.45, 0.65),
      vy: intensity === "showtime" ? randomBetween(30, 80) : randomBetween(20, 55),
      drift: randomBetween(-30, 30),
      wobble: randomBetween(0, Math.PI * 2),
      spin: randomBetween(-Math.PI, Math.PI),
      angle: randomBetween(0, Math.PI * 2),
      alpha: randomBetween(0.45, 0.88),
      hue: Math.random(),
    };
  }

  function seedPetals(): void {
    petals.length = 0;
    for (let index = 0; index < targetCount; index += 1) {
      petals.push(createPetal(index < targetCount * 0.4));
    }
  }

  function stop(): void {
    if (destroyed) {
      return;
    }
    destroyed = true;
    cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
    canvas.style.opacity = "0";
    window.setTimeout(() => canvas.remove(), 240);
    options.onFinish?.();
  }

  function drawPetal(petal: Petal): void {
    context.save();
    context.translate(petal.x, petal.y);
    context.rotate(petal.angle);

    // Draw a simple rounded ellipse for the petal shape
    context.beginPath();
    context.ellipse(0, 0, petal.rx, petal.ry, 0, 0, Math.PI * 2);

    // Very subtle inner highlight — lighter centre fading to the petal colour
    const grad = context.createRadialGradient(0, -petal.ry * 0.3, 0, 0, 0, petal.rx);
    grad.addColorStop(0, petalColor(petal.hue, petal.alpha));
    grad.addColorStop(1, petalColor(Math.min(petal.hue + 0.25, 1), petal.alpha * 0.65));
    context.fillStyle = grad;
    context.fill();

    context.restore();
  }

  function tick(timestamp: number): void {
    if (destroyed) {
      return;
    }

    const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;
    elapsed += deltaSeconds;

    context.clearRect(0, 0, width, height);

    for (const petal of petals) {
      petal.wobble += deltaSeconds * randomBetween(0.6, 1.4);
      petal.angle += petal.spin * deltaSeconds;
      petal.y += petal.vy * deltaSeconds;
      petal.x += (petal.drift + Math.sin(petal.wobble) * 18) * deltaSeconds;

      if (petal.y > height + 16 || petal.x < -32 || petal.x > width + 32) {
        Object.assign(petal, createPetal(true));
        continue;
      }

      drawPetal(petal);
    }

    if (elapsed > durationSeconds) {
      stop();
      return;
    }

    animationFrame = requestAnimationFrame(tick);
  }

  resize();
  seedPetals();
  window.addEventListener("resize", resize);
  requestAnimationFrame(() => {
    canvas.style.opacity = "1";
  });
  animationFrame = requestAnimationFrame(tick);

  return { stop };
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
