import React from 'react';
import { ALL_ROUTES, COMING_SOON_ROUTES } from '../data/routes';
import { LIVE_CONDITIONS } from '../data/liveConditions';
import { ChevronRight, Heart, Sun, Cloud, CloudRain, AlertTriangle, Info } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string, routeId?: string) => void;
  savedRouteIds: string[];
  onToggleSave: (id: string) => void;
}

// ─── Hero background illustration ───────────────────────────────────────────
const KrymSceneSVG = () => (
  <svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e4d6b" stopOpacity="0.55"/>
        <stop offset="100%" stopColor="#0d2233" stopOpacity="0.70"/>
      </linearGradient>
      <linearGradient id="mL" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2a5c24" stopOpacity="0.52"/>
        <stop offset="100%" stopColor="#1a3a18" stopOpacity="0.80"/>
      </linearGradient>
      <linearGradient id="mR" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a6e33" stopOpacity="0.42"/>
        <stop offset="100%" stopColor="#1a3a18" stopOpacity="0.70"/>
      </linearGradient>
    </defs>
    <rect x="0" y="82" width="360" height="48" fill="url(#seaG)"/>
    <line x1="0" y1="82" x2="360" y2="82" stroke="rgba(120,190,220,0.12)" strokeWidth="0.8"/>
    <path d="M 200 82 L 228 50 L 245 57 L 261 42 L 278 49 L 298 36 L 318 47 L 338 40 L 360 54 L 360 82 Z" fill="url(#mR)"/>
    <path d="M -10 82 L 28 54 L 52 61 L 76 40 L 104 53 L 130 36 L 158 49 L 178 82 Z" fill="url(#mL)"/>
    <path d="M 292 82 Q 308 73 300 64 Q 293 55 310 48 Q 324 43 318 36"
      fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1.6" strokeLinecap="round"/>
    <rect x="160" y="71" width="2" height="11" rx="1" fill="rgba(20,50,18,0.45)"/>
    <rect x="165" y="73" width="1.5" height="9" rx="1" fill="rgba(20,50,18,0.38)"/>
    <rect x="170" y="72" width="1.5" height="10" rx="1" fill="rgba(20,50,18,0.32)"/>
    <ellipse cx="80" cy="88" rx="20" ry="1.4" fill="rgba(150,210,240,0.05)"/>
    <ellipse cx="230" cy="93" rx="26" ry="1.4" fill="rgba(150,210,240,0.04)"/>
    <ellipse cx="330" cy="97" rx="18" ry="1.1" fill="rgba(150,210,240,0.04)"/>
  </svg>
);

// ─── Card illustrations by route theme ──────────────────────────────────────
// Each returns a small decorative SVG tuned to that route's landscape
const cardIllustrations: Record<string, () => React.ReactElement> = {
  // Ай-Петри — serpentine + plateau cliff
  'aipetri-by-car': () => (
    <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
      <path d="M 90 90 L 110 55 L 125 62 L 145 38 L 165 48 L 180 35 L 180 90 Z" fill="white"/>
      <path d="M 110 70 Q 125 62 118 52 Q 112 44 130 38 Q 144 33 138 26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // Алупка — park + sea
  'alupka-loop': () => (
    <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
      <rect x="0" y="72" width="180" height="18" fill="white"/>
      <ellipse cx="140" cy="60" rx="22" ry="28" fill="white"/>
      <ellipse cx="110" cy="64" rx="14" ry="20" fill="white"/>
      <ellipse cx="160" cy="66" rx="12" ry="18" fill="white"/>
    </svg>
  ),
  // Бирюзовое озеро — water + rocks
  'biruzovoe-ozero-zaprudnoe': () => (
    <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
      <ellipse cx="130" cy="70" rx="42" ry="18" fill="white"/>
      <path d="M 95 70 L 115 44 L 128 52 L 145 36 L 165 50 L 175 44 L 180 48 L 180 70 Z" fill="white"/>
    </svg>
  ),
  // Форос — church + cliff
  'foros-gates-church-park': () => (
    <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
      <path d="M 130 90 L 130 52 L 135 44 L 140 52 L 140 90 Z" fill="white"/>
      <path d="M 135 44 L 135 36" stroke="white" strokeWidth="1.5"/>
      <circle cx="135" cy="34" r="3" fill="white"/>
      <path d="M 100 90 L 120 58 L 140 65 L 160 48 L 180 58 L 180 90 Z" fill="white"/>
    </svg>
  ),
  // Старая дорога — serpentine road
  'old-sevastopol-road': () => (
    <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
      <path d="M 80 90 Q 130 80 120 65 Q 110 50 145 42 Q 165 36 158 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M 100 90 L 115 62 L 140 68 L 160 50 L 180 56 L 180 90 Z" fill="white"/>
    </svg>
  ),
  // Кореиз / русалка — sea + grotto arches
  'koreiz-miskhor-rusalka-grotto': () => (
    <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
      <rect x="0" y="65" width="180" height="25" fill="white"/>
      <path d="M 120 65 Q 135 52 145 65" fill="none" stroke="white" strokeWidth="2.5"/>
      <path d="M 148 65 Q 163 52 173 65" fill="none" stroke="white" strokeWidth="2.5"/>
      <ellipse cx="90" cy="58" rx="16" ry="8" fill="white" opacity="0.6"/>
    </svg>
  ),
  // Симеиз — Дива rock + sea
  'simeiz-park-diva': () => (
    <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
      <rect x="0" y="68" width="180" height="22" fill="white"/>
      <path d="M 145 68 L 148 48 Q 152 40 156 48 L 158 68 Z" fill="white"/>
      <path d="M 118 68 L 122 54 Q 126 46 130 54 L 132 68 Z" fill="white"/>
      <ellipse cx="155" cy="48" rx="10" ry="6" fill="white"/>
    </svg>
  ),
  // Гурзуф — набережная + море
  'gurzuf-old-town-pushkin-embankment': () => (
    <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
      <rect x="0" y="66" width="180" height="24" fill="white"/>
      <rect x="110" y="54" width="12" height="12" rx="1" fill="white"/>
      <rect x="126" y="50" width="14" height="16" rx="1" fill="white"/>
      <rect x="144" y="56" width="10" height="10" rx="1" fill="white"/>
      <rect x="158" y="52" width="12" height="14" rx="1" fill="white"/>
      <path d="M 110 54 L 116 46 L 122 54" fill="white"/>
      <path d="M 126 50 L 133 41 L 140 50" fill="white"/>
    </svg>
  ),
  // Учан-Су — водопад + лес
  'uchan-su-silver-gazebo-short': () => (
    <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
      <path d="M 140 30 Q 145 50 143 70 Q 141 80 140 90" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <ellipse cx="140" cy="72" rx="14" ry="6" fill="white" opacity="0.5"/>
      <ellipse cx="115" cy="55" rx="18" ry="22" fill="white"/>
      <ellipse cx="155" cy="58" rx="14" ry="18" fill="white"/>
      <ellipse cx="138" cy="50" rx="10" ry="14" fill="white"/>
    </svg>
  ),
  // Никитский сад — парк
  'nikitsky-garden-martyan': () => (
    <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
      <ellipse cx="130" cy="52" rx="26" ry="30" fill="white"/>
      <ellipse cx="155" cy="56" rx="18" ry="24" fill="white"/>
      <ellipse cx="110" cy="58" rx="16" ry="22" fill="white"/>
      <rect x="128" y="72" width="4" height="18" fill="white"/>
      <rect x="152" y="74" width="3" height="16" fill="white"/>
      <rect x="108" y="75" width="3" height="15" fill="white"/>
      <rect x="0" y="68" width="180" height="22" fill="white" opacity="0.3"/>
    </svg>
  ),
};

// Fallback: generic mountain + sea
const DefaultCardIllustration = () => (
  <svg viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 right-0 h-full w-auto opacity-[0.18]" aria-hidden="true">
    <path d="M 95 90 L 118 52 L 135 60 L 155 38 L 175 50 L 180 46 L 180 90 Z" fill="white"/>
    <rect x="0" y="74" width="180" height="16" fill="white"/>
  </svg>
);

// ─── Liquid-glass stat pill ──────────────────────────────────────────────────
const GlassPill = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div style={{
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.18)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 8px rgba(0,0,0,0.18)',
    borderRadius: '18px',
  }} className="flex flex-col items-center justify-center gap-1 py-3 px-2">
    <div style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.25))' }}>
      {icon}
    </div>
    <span className="text-[15px] font-bold text-white leading-none tracking-tight"
      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>{value}</span>
    <span className="text-[9px] font-semibold uppercase tracking-widest"
      style={{ color: 'rgba(200,240,200,0.6)' }}>{label}</span>
  </div>
);

// ─── Weather ─────────────────────────────────────────────────────────────────
const WeatherIcon = ({ label }: { label: string }) => {
  const l = label.toLowerCase();
  if (l.includes('дождь') || l.includes('ливень')) return <CloudRain className="w-3.5 h-3.5 text-sky-300"/>;
  if (l.includes('облач') || l.includes('пасмур')) return <Cloud className="w-3.5 h-3.5 text-stone-300"/>;
  return <Sun className="w-3.5 h-3.5 text-amber-300"/>;
};

const sevStyles = {
  normal:  { box: 'bg-emerald-950/30 border-white/10', icon: <Info className="w-3 h-3 text-emerald-300 shrink-0 mt-px"/>,       text: 'text-emerald-100/75' },
  caution: { box: 'bg-amber-900/30 border-amber-300/15', icon: <AlertTriangle className="w-3 h-3 text-amber-300 shrink-0 mt-px"/>, text: 'text-amber-100/80'   },
  danger:  { box: 'bg-red-900/35 border-red-300/15',   icon: <AlertTriangle className="w-3 h-3 text-red-300 shrink-0 mt-px"/>,   text: 'text-red-100/80'    },
};

// ─── Icons as tiny inline SVGs (no lucide dependency for map/timer/car) ──────
const IconMap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(134,239,172,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
const IconTimer = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(252,211,77,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/><path d="M12 2v3"/>
  </svg>
);
const IconCar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(134,239,172,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);
// ─── Main component ───────────────────────────────────────────────────────────
export default function HomeView({ onNavigate, savedRouteIds, onToggleSave }: HomeViewProps) {
  const routesForToday = ALL_ROUTES.slice(0, 10);
  const cond = LIVE_CONDITIONS;
  const sev = sevStyles[cond.severity];

  const getRussianDate = () => {
    const d = new Date();
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    const days = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
    return `${d.getDate()} ${months[d.getMonth()]}, ${days[d.getDay()]}`;
  };

  return (
    <div className="space-y-5 pb-24">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <div className="rounded-[28px] overflow-hidden relative text-white" style={{
        background: 'linear-gradient(160deg, #162e14 0%, #213d1e 40%, #2a5424 70%, #1e3d1b 100%)',
        boxShadow: '0 4px 28px rgba(20,50,18,0.32), 0 1px 3px rgba(0,0,0,0.15)',
        minHeight: '224px',
      }}>
        <KrymSceneSVG />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, rgba(20,48,18,0.58) 0%, rgba(20,48,18,0.04) 48%, rgba(10,28,10,0.38) 100%)'
        }}/>

        <div className="relative p-5 flex flex-col" style={{ minHeight: '224px' }}>

          {/* Top row */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest font-semibold font-display"
              style={{ color: 'rgba(167,243,208,0.6)' }}>
              ЮБК · {getRussianDate()}
            </p>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(10px)' }}>
              <WeatherIcon label={cond.weatherLabel}/>
              <span className="text-[11px] font-bold text-white">{cond.temperatureLabel}</span>
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{cond.weatherLabel}</span>
            </div>
          </div>

          <div className="flex-1" style={{ minHeight: '36px' }}/>

          {/* Title */}
          <div className="space-y-0.5 mb-4">
            <h1 className="text-[31px] font-bold tracking-tight text-white leading-tight font-display"
              style={{ textShadow: '0 1px 14px rgba(0,0,0,0.45)' }}>
              Поехали в Крым
            </h1>
            <p className="text-[12px] leading-snug" style={{ color: 'rgba(187,247,208,0.55)' }}>
              Маршруты ЮБК — горы, море, серпантины
            </p>
          </div>

          {/* ── Liquid-glass stat pills ── */}
          <div className="grid grid-cols-3 gap-2.5">
            <GlassPill icon={<IconMap/>}   value={String(ALL_ROUTES.length)}         label="маршрутов"/>
            <GlassPill icon={<IconTimer/>} value={String(COMING_SOON_ROUTES.length)} label="скоро"/>
            <GlassPill icon={<IconCar/>}   value="ЮБК"                              label="гайд"/>
          </div>

          {/* Status strip */}
          <div className={`flex items-start gap-2 mt-3 border rounded-xl px-3 py-2 ${sev.box}`}>
            {sev.icon}
            <p className={`text-[11px] leading-snug ${sev.text}`}>
              <span className="font-bold">{cond.mainWarningTitle}.</span>{' '}{cond.mainWarningText}
            </p>
          </div>

        </div>
      </div>

      {/* ══ READY ROUTES ═════════════════════════════════════════════════════ */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-stone-700 tracking-wider uppercase font-display">Готовые маршруты</h2>
          <button onClick={() => onNavigate('catalog')}
            className="text-[11px] font-bold text-[#2D5A27] flex items-center gap-0.5 hover:underline cursor-pointer">
            Все маршруты <ChevronRight className="w-3.5 h-3.5"/>
          </button>
        </div>

        <div className="space-y-3.5">
          {routesForToday.map((route) => {
            const isSaved = savedRouteIds.includes(route.id);
            const cardBadges = (route.badges || []).slice(0, 3);
            const IllustrationComp = cardIllustrations[route.id] || DefaultCardIllustration;
            return (
              <div key={route.id}
                className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden cursor-pointer"
                style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
                onClick={() => onNavigate('detail', route.id)}>

                {/* Card cover */}
                <div className="h-[118px] relative overflow-hidden" style={{ background: route.imageUrl }}>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.52) 100%)'
                  }}/>
                  {/* Decorative illustration — per route */}
                  <IllustrationComp />

                  {/* Content layer */}
                  <div className="absolute inset-0 p-3.5 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full text-white font-semibold"
                        style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {route.area}
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); onToggleSave(route.id); }}
                        className="p-1.5 rounded-full transition-colors"
                        style={{ background: 'rgba(0,0,0,0.24)', backdropFilter: 'blur(8px)' }}>
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-400 text-red-400' : 'text-white'}`}/>
                      </button>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight font-display drop-shadow-sm">{route.title}</h3>
                      <span className="text-[9px] px-2 py-0.5 rounded text-stone-200 uppercase tracking-wide mt-1 inline-block"
                        style={{ background: 'rgba(0,0,0,0.24)', backdropFilter: 'blur(6px)' }}>
                        {route.routeMode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-3.5 py-3 space-y-2.5">
                  {route.subtitle && (
                    <p className="text-[11px] text-stone-500 leading-snug line-clamp-2">{route.subtitle}</p>
                  )}
                  {(route.isPremium || cardBadges.length > 0) && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {route.isPremium && (
                        <span className="text-[9px] font-bold bg-[#2D5A27]/90 text-white px-2 py-0.5 rounded-lg uppercase tracking-wide">
                          🔒 Ранний доступ
                        </span>
                      )}
                      {cardBadges.map(badge => (
                        <span key={badge} className="text-[9px] font-semibold bg-stone-50 text-stone-500 border border-stone-100 px-2 py-0.5 rounded-lg">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                  {route.keyNuance && (
                    <p className="text-[11px] text-stone-500 leading-snug border-l-2 border-[#2D5A27]/25 pl-2.5">
                      {route.keyNuance}
                    </p>
                  )}
                  <button type="button"
                    className="w-full bg-[#2D5A27] text-white py-2.5 rounded-xl font-bold text-[11px] transition-colors hover:bg-[#1C3B1A] cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); onNavigate('detail', route.id); }}>
                    Открыть маршрут →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ COMING SOON ══════════════════════════════════════════════════════ */}
      {COMING_SOON_ROUTES.slice(0, 5).length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase font-display">Скоро добавим</h2>
            <span className="text-[10px] text-stone-400 font-medium">{COMING_SOON_ROUTES.length} маршрутов</span>
          </div>
          <div className="space-y-2">
            {COMING_SOON_ROUTES.slice(0, 5).map(route => (
              <div key={route.id} className="bg-stone-50 border border-stone-100 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-semibold text-stone-600 font-display truncate">{route.title}</p>
                  <p className="text-[10px] text-stone-400 truncate">{route.area} · {route.subtitle}</p>
                </div>
                <span className="shrink-0 text-[9px] font-bold text-stone-400 uppercase tracking-wide border border-stone-200 px-2 py-0.5 rounded-full bg-white">Скоро</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ PICKER BANNER ════════════════════════════════════════════════════ */}
      <div className="bg-[#F0ECE4] border border-[#DDD9D0] rounded-3xl p-5 flex items-center justify-between gap-3">
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-stone-800 font-display">Не знаете, куда поехать?</h4>
          <p className="text-[11px] text-stone-500 leading-relaxed">Ответьте на 4 вопроса — подберём подходящие маршруты.</p>
        </div>
        <button onClick={() => onNavigate('picker')}
          className="shrink-0 bg-[#2D5A27] hover:bg-[#1C3B1A] text-white p-3 rounded-2xl shadow-sm transition-all cursor-pointer">
          <ChevronRight className="w-5 h-5"/>
        </button>
      </div>

    </div>
  );
}
