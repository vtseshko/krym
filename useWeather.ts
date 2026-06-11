import { useEffect, useState } from 'react';
import { fetchWeather, NormalizedWeather } from '../services/weatherService';

interface UseWeatherResult {
  weather: NormalizedWeather | null;
  loading: boolean;
  error: boolean;
}

/**
 * Loads weather once per (lat, lng). The service layer handles
 * localStorage caching (45 min) and in-flight deduping, so mounting
 * several components with the same coords still costs one request.
 */
export function useWeather(lat: number | null, lng: number | null): UseWeatherResult {
  const [weather, setWeather] = useState<NormalizedWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(lat != null && lng != null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (lat == null || lng == null) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchWeather(lat, lng).then((data) => {
      if (cancelled) return;
      setWeather(data);
      setError(data === null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return { weather, loading, error };
}
