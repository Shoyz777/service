# Документы без юриста (MVP)

Fullstack SaaS-шаблон на Next.js + TypeScript:
- Шаблоны (Template + TemplateVersion)
- Мастер заполнения по схеме полей (variableSchema)
- Рендер документа в HTML (docModel) + сохранение версии
- Генерация PDF через Playwright
- (Заглушка) AI-подсказки заполнения

> Дисклеймер: проект — демонстрационный. Не является юридической консультацией.

## Быстрый старт (локально)

### 1) Установить зависимости
```bash
npm i
```

### 2) Настроить переменные окружения
Скопируй `.env.example` в `.env`:
```bash
cp .env.example .env
```

### 3) Поднять БД и засеять шаблоны
```bash
npm run prisma:migrate
npm run seed
```

### 4) Запуск
```bash
npm run dev
```

Открой: http://localhost:3000

## Что дальше (логичные улучшения)
- Auth (Auth.js / NextAuth), организации, роли
- Stripe подписки + лимиты (usage metering)
- Inngest/Trigger.dev для фоновых задач генерации
- DOCX экспорт (docx или docxtemplater)
- Поиск по документам (Postgres FTS / Meilisearch)
- AI-fill: строгий JSON (Zod) + нормальный промпт + ретраи
