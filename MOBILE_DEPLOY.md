# Деплой с телефона через GitHub + Netlify/Vercel

## Что заливать в GitHub

Заливай **распакованное содержимое** архива, не сам zip.

В корне репозитория должны лежать именно эти файлы и папки:

```text
package.json
package-lock.json
index.html
vite.config.ts
tsconfig.json
vercel.json
README.md
MOBILE_DEPLOY.md
.gitignore
public/
src/
```

Важно: файлы из `src` должны остаться внутри папки `src`, например:

```text
src/components/DetailView.tsx
src/components/UpdateStatusView.tsx
src/lib/routeLinks.ts
src/data/routes.ts
```

Не загружай файлы `weatherService.ts`, `routes.ts`, `DetailView.tsx` и другие `.ts/.tsx` просто в корень репы.

## Что НЕ заливать

Не заливай:

```text
node_modules/
dist/
старые zip архивы
```

## Если грузишь с телефона

1. Распакуй `poehali-v-krym-final-github-ready.zip`.
2. В GitHub открой репозиторий.
3. Лучше включи в браузере режим **Desktop site / Версия для ПК**.
4. Нажми **Add file → Upload files**.
5. Загрузи содержимое архива так, чтобы папки `src` и `public` сохранились как папки.
6. Сделай commit.

Если мобильный GitHub ломает папки и кидает всё в корень, не продолжай. Так проект не соберётся. В этом случае проще загрузить с ПК или через GitHub Desktop.

## Деплой на Netlify через GitHub

1. Netlify → Add new site → Import an existing project.
2. Выбери GitHub repo.
3. Build command:

```text
npm run build
```

4. Publish directory:

```text
dist
```

5. Deploy.

## Деплой на Vercel через GitHub

1. Vercel → Add New Project.
2. Import GitHub repo.
3. Framework Preset: Vite.
4. Build Command:

```text
npm run build
```

5. Output Directory:

```text
dist
```

6. Root Directory: пусто, если `package.json` лежит в корне репозитория.

## Быстрый вариант без GitHub

Если нужно просто быстро показать людям:

1. Возьми `poehali-v-krym-final-static-dist.zip`.
2. Распакуй.
3. Зайди на Netlify Drop.
4. Перетащи папку `dist`.

## Проверить после деплоя

- главная открывается
- нижняя навигация видна
- маршрут открывается
- кнопка “Построить весь маршрут” открывает выбор карт
- Яндекс Карты открываются
- Яндекс Навигатор открывается, если установлен и WebView разрешает scheme
- Google Maps открывается
- 2ГИС открывает начало → финиш
- “Скопировать все точки” работает
- экран “Обновить статус” можно долистать до кнопки
- footer-кнопки “Сохранить / Поделиться” внизу маршрута доступны
