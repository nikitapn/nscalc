type ShakaNamespace = typeof import("shaka-player/dist/shaka-player.dash").default;

let shakaLoadPromise: Promise<ShakaNamespace> | null = null;

export function loadShakaPlayer(): Promise<ShakaNamespace> {
  if (shakaLoadPromise) return shakaLoadPromise;

  shakaLoadPromise = import("shaka-player/dist/shaka-player.dash")
    .then((m) => m.default)
    .catch((err: unknown) => {
      shakaLoadPromise = null;
      throw err;
    });

  return shakaLoadPromise;
}