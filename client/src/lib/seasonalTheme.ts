import type { SiteEventVariant } from "./adminEvents";

export type Season = "spring" | "summer" | "autumn" | "winter" | "default";

/** Map a site-event variant to the season whose theme it should activate. */
export function seasonForVariant(variant: SiteEventVariant): Season {
  if (variant === "petals") return "spring";
  if (variant === "snow") return "winter";
  return "default"; // fireworks → New Year, keep the base ocean theme
}

/**
 * Write `data-season` on <html> so the CSS variable overrides in app.css
 * take effect.  Passing "default" (or no season) removes the attribute and
 * falls back to the base @theme palette.
 */
export function applySeasonalTheme(season: Season): void {
  if (season === "default") {
    document.documentElement.removeAttribute("data-season");
  } else {
    document.documentElement.dataset.season = season;
  }
}
