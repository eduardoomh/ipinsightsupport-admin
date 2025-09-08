// ~/utils/general/timezone.ts
export const TIMEZONES = [
  "EASTERN",
  "CENTRAL",
  "PACIFIC",
  "MOUNTAIN",
  "EUROPE",
  "ASIA",
  "AFRICA",
  "LATAM",
  "AUSTRALIA_NZ"
] as const;

export type Timezone = typeof TIMEZONES[number];

export const getTimezoneLabel = (tz: Timezone): string => {
  switch (tz) {
    case "EASTERN":
      return "Eastern (US)";
    case "CENTRAL":
      return "Central (US)";
    case "PACIFIC":
      return "Pacific (US)";
    case "MOUNTAIN":
      return "Mountain (US)";
    case "EUROPE":
      return "Europe";
    case "ASIA":
      return "Asia";
    case "AFRICA":
      return "Africa";
    case "LATAM":
      return "Latin America";
    case "AUSTRALIA_NZ":
      return "Australia / NZ";
    default:
      return tz; // fallback
  }
};