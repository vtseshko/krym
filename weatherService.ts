// Live weather / route conditions via Open-Meteo (no API key, no backend).
// Single small request per location, localStorage cache, honest fallbacks.

import { Route } from '../types';

export interface NormalizedWeather {
  temperature: number;          // °C
  apparentTemperature: number | null;
  precipitation: number | null; // mm (current)
  weatherCode: number;
  cloudCover: number | null;    // %
  windSpeed: number | null;     // m/s
  description: string;          // human Russian text
  fetchedAt: number;            // epoch ms
}

export type WeatherStatusLevel = 'good' | 'caution' | 'bad' | 'unknown';

export interface RouteWeatherStatus {
  level: WeatherStatusLevel;
  title: string;
  message: string;
}

const CACHE_TTL_MS = 45 * 60 * 1000; // 45 minutes
const FETCH_TIMEOUT_MS = 6000;

const cacheKey = (lat: number, lng: number) =>
  `weather:${lat.toFixed(3)},${lng.toFixed(3)}`;

// ── WMO weather code → Russian description ──────────────────────────────────
export function describeWeatherCode(code: number): string {
  if (code === 0) return 'ясно';
  if (code === 1) return 'в основном ясно';
  if (code === 2) return 'переменная облачность';
  if (code === 3) return 'пасмурно';
  if (code === 45 || code === 48) return 'туман';
  if (code >= 51 && code <= 57) return 'морось';
  if (code === 61 || code === 63) return 'дождь';
  if (code === 65) return 'сильный дождь';
  if (code === 66 || code === 67) return 'ледяной дождь';
  if (code >= 71 && code <= 77) return 'снег';
  if (code === 80 || code === 81) return 'ливни';
  if (code === 82) return 'сильный ливень';
  if (code === 85 || code === 86) return 'снегопад';
  if (code === 95) return 'гроза';
  if (code === 96 || code === 99) return 'гроза с градом';
  return 'условия уточняются';
}

// ── Cache helpers ────────────────────────────────────────────────────────────
function readCache(lat: number, lng: number): NormalizedWeather | null {
  try {
    const raw = localStorage.getItem(cacheKey(lat, lng));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NormalizedWeather;
    if (typeof parsed?.fetchedAt !== 'number') return null;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(lat: number, lng: number, data: NormalizedWeather) {
  try {
    localStorage.setItem(cacheKey(lat, lng), JSON.stringify(data));
  } catch {
    // storage unavailable — fine, we just skip caching
  }
}

// Dedupe concurrent requests for the same coords within one session
const inFlight = new Map<string, Promise<NormalizedWeather | null>>();

// ── Fetch + normalize ────────────────────────────────────────────────────────
export async function fetchWeather(lat: number, lng: number): Promise<NormalizedWeather | null> {
  const cached = readCache(lat, lng);
  if (cached) return cached;

  const key = cacheKey(lat, lng);
  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = (async (): Promise<NormalizedWeather | null> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}` +
        `&current=temperature_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m` +
        `&wind_speed_unit=ms&timezone=auto`;

      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) return null;

      const json: any = await res.json();
      const cur = json?.current;
      if (!cur || typeof cur.temperature_2m !== 'number' || typeof cur.weather_code !== 'number') {
        return null;
      }

      const normalized: NormalizedWeather = {
        temperature: Math.round(cur.temperature_2m),
        apparentTemperature:
          typeof cur.apparent_temperature === 'number' ? Math.round(cur.apparent_temperature) : null,
        precipitation: typeof cur.precipitation === 'number' ? cur.precipitation : null,
        weatherCode: cur.weather_code,
        cloudCover: typeof cur.cloud_cover === 'number' ? cur.cloud_cover : null,
        windSpeed: typeof cur.wind_speed_10m === 'number' ? Math.round(cur.wind_speed_10m) : null,
        description: describeWeatherCode(cur.weather_code),
        fetchedAt: Date.now()
      };

      writeCache(lat, lng, normalized);
      return normalized;
    } catch {
      return null; // network error / timeout / bad JSON → honest fallback in UI
    } finally {
      clearTimeout(timer);
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, promise);
  return promise;
}

// ── Route-aware safety estimate ──────────────────────────────────────────────
const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 66, 67, 80, 81]);
const HEAVY_CODES = new Set([65, 82, 95, 96, 99]);
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const FOG_CODES = new Set([45, 48]);

function routeIsExposed(route?: Pick<Route, 'tags' | 'routeFormat'> | null): {
  mountain: boolean; serpentine: boolean; sea: boolean; walk: boolean;
} {
  const tags = (route?.tags || []).map((t) => t.toLowerCase());
  const has = (s: string) => tags.some((t) => t.includes(s));
  return {
    mountain: has('гор') || has('панорам') || has('плато'),
    serpentine: has('серпантин'),
    sea: has('море'),
    walk: route?.routeFormat === 'walk' || route?.routeFormat === 'with_drive'
  };
}

export function getRouteWeatherStatus(
  weather: NormalizedWeather | null,
  route?: Pick<Route, 'tags' | 'routeFormat'> | null
): RouteWeatherStatus {
  if (!weather) {
    return {
      level: 'unknown',
      title: 'Условия уточняются',
      message: 'Погоду не удалось загрузить. Проверьте условия перед выездом.'
    };
  }

  const ctx = routeIsExposed(route);
  const code = weather.weatherCode;
  const wind = weather.windSpeed ?? 0;
  const feels = weather.apparentTemperature ?? weather.temperature;
  const precip = weather.precipitation ?? 0;

  // Heavy rain / thunderstorm — bad
  if (HEAVY_CODES.has(code)) {
    return {
      level: 'bad',
      title: 'По прогнозу сильные осадки',
      message: ctx.serpentine
        ? 'В сильный дождь серпантин лучше отложить. После дождя камни и тропы могут быть скользкими.'
        : 'После дождя камни, лестницы и тропы могут быть скользкими. Лучше перенести выезд.'
    };
  }

  // Snow / ice
  if (SNOW_CODES.has(code) || code === 66 || code === 67) {
    return {
      level: ctx.serpentine || ctx.mountain ? 'bad' : 'caution',
      title: 'По прогнозу снег или гололёд',
      message: 'В горах и на серпантинах возможен гололёд. Проверьте состояние дороги перед выездом.'
    };
  }

  // Fog — worse for mountain / viewpoint / serpentine routes
  if (FOG_CODES.has(code)) {
    return {
      level: ctx.mountain || ctx.serpentine ? 'bad' : 'caution',
      title: 'По прогнозу туман',
      message: 'В туман виды пропадают, а серпантин становится неприятнее. Проверьте видимость перед выездом.'
    };
  }

  // Rain / drizzle / showers — caution
  if (RAIN_CODES.has(code) || precip > 0.5) {
    return {
      level: 'caution',
      title: 'По прогнозу осадки',
      message: ctx.walk
        ? 'После дождя камни, лестницы и тропы могут быть скользкими.'
        : 'Возможны осадки — проверьте прогноз и состояние дороги перед выездом.'
    };
  }

  // Strong wind
  if (wind >= 14) {
    return {
      level: 'bad',
      title: 'По прогнозу сильный ветер',
      message: 'На видовых точках и у моря может быть некомфортно. Проверьте прогноз перед выездом.'
    };
  }
  if (wind >= 8) {
    return {
      level: 'caution',
      title: 'По прогнозу ветрено',
      message: ctx.sea || ctx.mountain
        ? 'На видовых точках и у моря может быть некомфортно. Проверьте прогноз перед выездом.'
        : 'Ветрено — ориентируйтесь по прогнозу ближе к выезду.'
    };
  }

  // Heat
  if (feels >= 30) {
    return {
      level: 'caution',
      title: 'По прогнозу жарко',
      message: 'Лучше ехать утром или ближе к вечеру, взять воду и головной убор.'
    };
  }

  return {
    level: 'good',
    title: 'По прогнозу спокойно',
    message: 'По прогнозу условия выглядят спокойными, но перед выездом всё равно проверьте дорогу и доступ.'
  };
}
