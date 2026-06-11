import {
  DifficultySlug,
  MasterRoute,
  PassabilitySlug,
  Route,
  RouteFormat,
  RouteCardType,
  RoutePoint
} from '../types';
import { MASTER_ROUTES } from './masterRoutes';

const GRADIENTS = [
  'radial-gradient(circle at top left, #2e4a3f, #1a2f26)',
  'radial-gradient(circle at top left, #34485a, #16222d)',
  'radial-gradient(circle at top left, #4a3d2e, #21180f)',
  'radial-gradient(circle at top left, #2a4c48, #0f2421)',
  'radial-gradient(circle at top left, #483d4c, #1f1821)',
  'radial-gradient(circle at top left, #284158, #111f2b)'
];

const AREA_BY_ROUTE_ID: Record<string, string> = {
  'aipetri-by-car': 'Ай-Петри',
  'alupka-loop': 'Алупка',
  'biruzovoe-ozero-zaprudnoe': 'Запрудное',
  'foros-gates-church-park': 'Форос',
  'old-sevastopol-road': 'ЮБК',
  'koreiz-miskhor-rusalka-grotto': 'Кореиз / Мисхор',
  'simeiz-park-diva': 'Симеиз',
  'gurzuf-old-town-pushkin-embankment': 'Гурзуф',
  'uchan-su-silver-gazebo-short': 'Ялта',
  'nikitsky-garden-martyan': 'Никита'
};

export interface ComingSoonRoute {
  id: string;
  title: string;
  area: string;
  subtitle: string;
}

export const COMING_SOON_ROUTES: ComingSoonRoute[] = [
  { id: 'livadia-sunny-path', title: 'Ливадийская / Солнечная тропа', area: 'Ливадия', subtitle: 'Спокойная прогулка с видами над побережьем' },
  { id: 'nikitskaya-rasselina', title: 'Никитская расселина', area: 'Никита', subtitle: 'Скальная прогулка рядом с Никитой' },
  { id: 'hasta-bash-uch-kosh', title: 'Хаста-Баш / Уч-Кош', area: 'Ялта', subtitle: 'Ущелье и лесной маршрут' },
  { id: 'koreiz-biruzovoe-5-lisichka', title: 'Кореиз → Бирюзовое → 5-й водоём', area: 'Кореиз', subtitle: 'Горная связка над посёлком' },
  { id: 'mangup-kale', title: 'Мангуп-Кале', area: 'Бахчисарай', subtitle: 'Пещерный город и плато' },
  { id: 'demerdzhi', title: 'Демерджи', area: 'Алушта', subtitle: 'Горы и Долина привидений' },
  { id: 'grand-canyon-crimea', title: 'Большой каньон Крыма', area: 'Бахчисарай', subtitle: 'Вода, скалы и длинная прогулка' },
  { id: 'shaitan-merdven', title: 'Чёртова лестница', area: 'ЮБК', subtitle: 'Исторический горный подъём' },
  { id: 'taraktash-trail', title: 'Таракташская тропа', area: 'Ялта', subtitle: 'Классический подъём над Учан-Су' },
  { id: 'botkin-shtangeevskaya', title: 'Боткинская / Штангеевская тропа', area: 'Ялта', subtitle: 'Лес, скалы и виды над Ялтой' },
  { id: 'novyi-svet-golitsyn', title: 'Новый Свет / тропа Голицына', area: 'Новый Свет', subtitle: 'Море, гроты и тропа над бухтами' },
  { id: 'balaklava-fiolent', title: 'Балаклава / Фиолент', area: 'Севастополь', subtitle: 'Мыс, бухты и морские виды' }
];

export const ROUTE_FORMAT_LABELS: Record<RouteFormat, string> = {
  walk: 'Пешком',
  with_drive: 'С подъездом',
  drive: 'На машине'
};

const inferRouteFormat = (route: MasterRoute): RouteFormat => {
  if (route.routeMode === 'Пешком') return 'walk';
  if (route.routeMode === 'Машина + пешком') return 'with_drive';
  return 'drive';
};

const normalizeHours = (duration: string) => {
  if (!duration) return null;
  if (duration.toLowerCase().includes('полдня')) return 5;

  const normalized = duration.replace(',', '.');
  const range = normalized.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*ч/i);
  if (range) return (Number(range[1]) + Number(range[2])) / 2;

  const singleHour = normalized.match(/(\d+(?:\.\d+)?)\s*ч/i);
  if (singleHour) return Number(singleHour[1]);

  const minutes = normalized.match(/(\d+)\s*[–-]\s*(\d+)\s*мин/i);
  if (minutes) return (Number(minutes[1]) + Number(minutes[2])) / 120;

  return null;
};

const inferRouteType = (route: MasterRoute): RouteCardType => {
  if (route.routeMode === 'Только на машине' || route.routeMode === 'На машине') return 'scenic_drive';
  if (route.routeMode === 'Пешком') return 'short_walk';
  return 'full_route';
};

const getDifficultySlug = (route: MasterRoute): DifficultySlug => {
  const text = [route.keyNuance, route.difficulty, route.warnings.map((warning) => warning.text).join(' ')].join(' ').toLowerCase();
  if (text.includes('обрыв') || text.includes('крутая') || text.includes('скользкая') || text.includes('сильный набор')) {
    return 'hard';
  }
  if (text.includes('лестниц') || text.includes('уклон') || text.includes('серпантин') || text.includes('подъём') || text.includes('подъем')) {
    return 'medium';
  }
  return 'easy';
};

const getDifficultyLabel = (slug: DifficultySlug) => {
  if (slug === 'hard') return 'Сложная';
  if (slug === 'medium') return 'Средняя';
  return 'Лёгкая';
};

const getPassabilitySlug = (route: MasterRoute): PassabilitySlug => {
  const text = [route.keyNuance, route.parkingNotes, route.accessNotes].join(' ').toLowerCase();
  if (text.includes('внедорожник') || text.includes('высоким клиренсом')) return 'clearance';
  return 'unknown';
};

const getDistance = (route: MasterRoute) => {
  const badgeDistance = route.badges.find((badge) => badge.includes('км'));
  if (badgeDistance) return badgeDistance;

  const text = [route.detailSections.summary, route.detailSections.routeFlow].join(' ');
  const distance = text.match(/(?:около\s*)?(\d+(?:[.,]\d+)?(?:\s*[–-]\s*\d+(?:[.,]\d+)?)?)\s*км/i);
  if (distance) return distance[1].replace(/\s+/g, '') + ' км';

  return route.routeMode;
};

const firstPointWithRole = (points: RoutePoint[], role: RoutePoint['roles'][number]) =>
  points.find((point) => point.roles.includes(role));

const toCoordinateString = (point?: RoutePoint) => (point ? `${point.lat}, ${point.lng}` : 'Координаты уточняются');

const routeTypeLabel = (route: MasterRoute) => route.routeMode || 'Маршрут';

const buildTags = (route: MasterRoute, area: string) => {
  const tags = [area, ...route.badges, route.routeMode];
  const text = [
    route.title,
    route.subtitle,
    route.keyNuance,
    route.detailSections.summary,
    route.detailSections.routeFlow
  ].join(' ').toLowerCase();

  if (text.includes('ай-петри') || text.includes('плато') || text.includes('гора') || text.includes('скала')) tags.push('Горы');
  if (text.includes('вид') || text.includes('смотров') || text.includes('панорам')) tags.push('Панорама');
  if (text.includes('море') || text.includes('набереж') || text.includes('пляж') || text.includes('русалк')) tags.push('Море');
  if (text.includes('водопад') || text.includes('озеро')) tags.push('Вода');
  if (text.includes('парк') || text.includes('сад')) tags.push('Парк');
  if (text.includes('дворец') || text.includes('церковь') || text.includes('храм') || text.includes('старый город')) tags.push('История');
  if (route.routeMode === 'Пешком') tags.push('Пешком');
  if (route.routeMode === 'С подъездом') tags.push('С подъездом');
  if (route.routeMode === 'На машине' || route.routeMode === 'Только на машине') tags.push('На машине');

  return Array.from(new Set(tags.filter(Boolean)));
};

const toRoute = (route: MasterRoute, index: number): Route => {
  const routeType = inferRouteType(route);
  const routeFormat = route.routeFormat || inferRouteFormat(route);
  const routeFormatLabel = ROUTE_FORMAT_LABELS[routeFormat];
  const difficultySlug = getDifficultySlug(route);
  const passabilitySlug = getPassabilitySlug(route);
  const parkingPoint = firstPointWithRole(route.points, 'parking');
  const dangerWarning = route.warnings.find((warning) => warning.level === 'danger');
  const displayBadges = [routeFormatLabel, ...route.badges.slice(1)];
  if (difficultySlug === 'hard' && !displayBadges.includes('Для подготовленных')) {
    displayBadges.push('Для подготовленных');
  }

  return {
    id: route.id,
    title: route.title,
    subtitle: route.subtitle,
    badges: displayBadges,
    keyNuance: route.keyNuance,
    routeMode: routeFormatLabel,
    routeFormat,
    compactCard: { ...route.compactCard, badges: displayBadges },
    detailSections: route.detailSections,
    warnings: route.warnings,
    points: route.points,
    parkingNotes: route.parkingNotes,
    accessNotes: route.accessNotes,
    bestTime: route.bestTime,
    area: AREA_BY_ROUTE_ID[route.id] || 'Крым',
    routeType,
    routeTypeLabel: routeFormatLabel,
    releaseGroup: 'now_mvp',
    releaseLabel: 'ЮБК',
    priority: index + 1,
    verificationStatus: 'good_candidate',
    verificationLabel: dangerWarning ? 'Нужна проверка безопасности' : 'На проверке',
    isComingSoon: false,
    isDraft: false,
    duration: route.duration,
    durationHours: normalizeHours(route.duration),
    distance: getDistance(route),
    difficulty: getDifficultyLabel(difficultySlug),
    difficultySlug,
    transportType: routeFormatLabel,
    passability: route.keyNuance,
    passabilitySlug,
    tags: buildTags({ ...route, routeMode: routeFormatLabel, badges: displayBadges }, AREA_BY_ROUTE_ID[route.id] || 'Крым'),
    imageUrl: GRADIENTS[index % GRADIENTS.length],
    shortDescription: route.keyNuance,
    description: route.detailSections.summary,
    roadCondition: route.accessNotes,
    walkingPart: route.detailSections.routeFlow,
    whatToCheck: route.keyNuance,
    coordinates: route.points.map((point) => `${point.lat}, ${point.lng}`),
    hasDetailedPlan: true,
    status: {
      trail: dangerWarning ? 'Частично' : 'Открыта',
      parking: 'Парковка требует проверки',
      road: 'Подъезд требует проверки',
      crowd: 'Средне',
      updatedAt: 'На проверке',
      note: route.keyNuance
    },
    warning: dangerWarning?.text,
    parkingInfo: {
      title: parkingPoint?.title || 'Где оставить машину',
      description: route.parkingNotes,
      price: 'Проверить на месте',
      coordinates: toCoordinateString(parkingPoint)
    },
    stepByStep: route.detailSections.steps.map((step, stepIndex) => ({
      number: stepIndex + 1,
      time: `Шаг ${stepIndex + 1}`,
      title: step,
      description: ''
    })),
    whenToGo: {
      best: route.bestTime,
      morning: route.bestTime,
      avoid: dangerWarning?.text || route.keyNuance
    },
    notSuitableFor: route.notFor,
    whatToTake: route.whatToBring
  };
};

export const ALL_ROUTES: Route[] = MASTER_ROUTES.map(toRoute);
