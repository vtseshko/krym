export interface TripStep {
  number: number;
  time: string;
  title: string;
  description: string;
}

export type RouteWarningLevel = 'danger' | 'caution' | 'info';
export type RoutePointRole = 'parking' | 'start' | 'stop' | 'viewpoint' | 'finish' | 'optional';

export interface RouteWarning {
  level: RouteWarningLevel;
  text: string;
}

export interface RoutePoint {
  roles: RoutePointRole[];
  title: string;
  description?: string;
  lat: number;
  lng: number;
}

export interface RouteDetailSections {
  summary: string;
  routeFlow: string;
  parking: string;
  steps: string[];
}

export interface RouteCompactCard {
  title: string;
  subtitle: string;
  badges: string[];
  keyNuance: string;
}

export type RouteFormat = 'walk' | 'with_drive' | 'drive';

export interface MasterRoute {
  id: string;
  title: string;
  subtitle: string;
  badges: string[];
  keyNuance: string;
  routeMode: string;
  routeFormat?: RouteFormat;
  duration: string;
  difficulty: string;
  compactCard: RouteCompactCard;
  detailSections: RouteDetailSections;
  warnings: RouteWarning[];
  points: RoutePoint[];
  parkingNotes: string;
  accessNotes: string;
  whatToBring: string[];
  notFor: string[];
  bestTime: string;
}

export type DifficultyType = 'Лёгкая' | 'Средняя' | 'Сложная';
export type TransportType = 'Любой авто' | 'Кроссовер' | 'Внедорожник';
export type PassabilityType = 'Асфальт' | 'Грунтовка в норме' | 'Нужен клиренс';
export type DifficultySlug = 'easy' | 'medium' | 'hard' | 'unknown';
export type PassabilitySlug = 'asphalt' | 'dirt' | 'clearance' | 'unknown';
export type RouteCardType =
  | 'full_route'
  | 'short_walk'
  | 'scenic_drive'
  | 'drive_stop'
  | 'place_addon'
  | 'advanced_later';
export type RouteReleaseGroup = 'now_mvp' | 'next_ybk' | 'later_crimea';
export type RouteVerificationStatus =
  | 'good_candidate'
  | 'needs_map_check'
  | 'needs_local_check'
  | 'needs_access_check'
  | 'needs_safety_check'
  | 'next_release'
  | 'place_addon'
  | 'advanced_later';

export interface RouteStatus {
  trail: 'Открыта' | 'Частично' | 'Закрыта' | 'Проверить';
  parking: 'Свободно' | 'Мало мест' | 'Забито' | 'Парковка требует проверки';
  road: 'Седан проедет' | 'Кроссовер' | 'Клиренс' | 'Закрыто' | 'Подъезд требует проверки';
  crowd: 'Мало' | 'Средне' | 'Много';
  updatedAt: string; // e.g. "2 ч назад" or "Сегодня"
  note?: string;
}

export interface Route {
  id: string;
  isPremium?: boolean;
  isComingSoon?: boolean;
  isDraft?: boolean;
  title: string;
  area: string;          // e.g. "Симеиз", "Форос", "Ялта"
  duration: string;      // e.g. "3-4 ч"
  durationHours: number | null; // For filtering, e.g. 3.5, 2, 8. null = not verified yet.
  distance: string;      // e.g. "6 км"
  difficulty: DifficultyType | string;
  difficultySlug: DifficultySlug;
  transportType: TransportType | string;
  passability: PassabilityType | string;
  passabilitySlug: PassabilitySlug;
  routeFormat: RouteFormat;
  tags: string[];        // e.g. ["Горы", "Панорама", "Закат", "Скалы"]
  routeType: RouteCardType;
  routeTypeLabel: string;
  releaseGroup: RouteReleaseGroup;
  releaseLabel: string;
  priority: number;
  verificationStatus: RouteVerificationStatus;
  verificationLabel: string;
  shortDescription?: string;
  description?: string;
  roadCondition?: string;
  walkingPart?: string;
  whatToCheck?: string;
  source?: string;
  coordinates?: string[];
  hasDetailedPlan?: boolean;
  
  // Detail info
  imageUrl: string;      // Fallback CSS gradient or nice Unsplash style representation
  status: RouteStatus;
  warning?: string;
  subtitle?: string;
  badges?: string[];
  keyNuance?: string;
  routeMode?: string;
  compactCard?: RouteCompactCard;
  detailSections?: RouteDetailSections;
  warnings?: RouteWarning[];
  points?: RoutePoint[];
  parkingNotes?: string;
  accessNotes?: string;
  bestTime?: string;
  coverImage?: string;
  parkingInfo: {
    title: string;
    description: string;
    price: 'Бесплатно' | 'Платно' | string;
    coordinates: string;
  };
  stepByStep: TripStep[];
  whenToGo: {
    best: string;
    morning: string;
    avoid: string;
  };
  notSuitableFor: string[];
  whatToTake: string[];
}

export interface SavedRoute {
  id: string;
  savedAt: string;
}

export interface StatusUpdateForm {
  routeId: string;
  trail: 'Открыта' | 'Частично' | 'Закрыта';
  parking: 'Свободно' | 'Мало мест' | 'Забито';
  road: 'Седан проедет' | 'Кроссовер' | 'Клиренс';
  crowd: 'Мало' | 'Средне' | 'Много';
  note: string;
}
