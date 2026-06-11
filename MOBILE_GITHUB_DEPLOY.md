# Деплой с телефона через GitHub

## Вариант 1 — лучший: GitHub → Vercel

1. Создайте новый репозиторий на GitHub, например `poehali-v-krym`.
2. Загрузите файлы проекта в корень репозитория.
3. Откройте Vercel → Add New Project → Import GitHub Repository.
4. Настройки Vercel:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: оставить пустым, если package.json в корне
```

5. Нажмите Deploy.

## Вариант 2 — GitHub Pages

В проекте уже есть workflow:

```text
.github/workflows/pages.yml
```

После загрузки проекта в GitHub:

1. Откройте Settings → Pages.
2. В Source выберите GitHub Actions.
3. Откройте Actions и дождитесь завершения `Deploy to GitHub Pages`.

## Важно про загрузку с телефона

GitHub не распаковывает zip автоматически. Если загрузить в репозиторий просто `.zip`, Vercel/GitHub Pages не увидят проект.

Нужно загрузить именно распакованные файлы:

```text
package.json
package-lock.json
src/
public/
index.html
vite.config.ts
tsconfig.json
vercel.json
.github/
```

Если с телефона неудобно грузить папки через GitHub web, самые нормальные варианты:

1. Открыть GitHub в браузере и включить «Версия для ПК».
2. Использовать GitHub Codespaces, загрузить zip туда, распаковать и сделать commit.
3. Попросить ассистента/другой инструмент с GitHub-доступом залить проект в репозиторий.

## Проверка после деплоя

Проверьте на телефоне:

- главная открывается
- погода/условия грузятся
- маршруты открываются
- точки открываются в навигаторе
- сохранённые работают
- нижняя навигация не перекрывает контент
- ссылка красиво открывается в Telegram/WhatsApp
