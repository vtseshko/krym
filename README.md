# Поехали в Крым — маршруты по ЮБК

Первая версия preview мобильного PWA-гида по маршрутам Южного берега Крыма: прогулки, автосценарии, парковки, предупреждения, точки для навигатора и ориентир по погодным условиям.

Стек: React 19 + Vite 6 + TypeScript + Tailwind CSS 4.

## Что сейчас в MVP

- 10 готовых маршрутов, 12 маршрутов в разделе «скоро»
- Страницы маршрутов: краткое описание, парковка, предупреждения, что взять, точки с координатами
- Открытие точек в Яндекс Картах, Google Maps и 2ГИС, копирование координат
- Фильтры и подбор маршрута
- Закладки через localStorage
- Live weather / route conditions через Open-Meteo без API key
- Блок «Актуальная обстановка» и форма обратной связи в preview-режиме
- PWA: установка на главный экран, базовый офлайн-фолбэк

## Что пока не реализовано

- Полноценный backend для пользовательских отчётов
- Модерация фото, отзывов и route condition reports
- Оплата и платные route packs
- Офлайн-карты
- Реальные карты внутри приложения через SDK

## Запуск локально

```bash
npm install
npm run dev
```

Dev-сервер откроется на:

```text
http://localhost:3000
```

## Сборка и проверка

```bash
npm run lint
npm run build
npm run preview
```

`npm run lint` сейчас запускает TypeScript-проверку через `tsc --noEmit`.

## Деплой на Vercel

Если проект лежит в корне репозитория:

```text
Root Directory: пусто / корень проекта
Build Command: npm run build
Output Directory: dist
```

Если проект лежит внутри папки `app`, укажите:

```text
Root Directory: app
Build Command: npm run build
Output Directory: dist
```

`vercel.json` уже настроен для SPA fallback на `index.html`.

## Деплой на Netlify

```text
Build command: npm run build
Publish directory: dist
```

SPA redirect лежит в `public/_redirects`.

## GitHub Pages

В проект добавлен workflow `.github/workflows/pages.yml`. Он собирает Vite-проект и публикует папку `dist` в GitHub Pages.

После загрузки проекта в репозиторий:

1. Откройте Settings → Pages.
2. В Source выберите GitHub Actions.
3. Сделайте push в ветку `main`.
4. Дождитесь завершения action `Deploy to GitHub Pages`.

## Важно

Это preview для тестирования. Данные маршрутов ориентировочные. Перед поездкой проверяйте погоду, состояние дороги, доступ и режим объектов, особенно в горах, заповедниках и на серпантинах.

Погода берётся через Open-Meteo и используется только как ориентир. Это не гарантия безопасности поездки.
