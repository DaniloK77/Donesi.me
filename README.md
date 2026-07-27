# dostavi.me API

Express REST API for the dostavi.me food delivery application.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

The health check is available at `GET /health`.

## Database

Apply committed migrations and load the development data:

```bash
npx prisma migrate deploy
npm run db:seed
```

The seed is idempotent and includes seven Podgorica restaurants with complete
menus.

## Restaurant endpoints

- `GET /api/restaurants` returns ordered restaurant summaries without menus.
- `GET /api/restaurants/:slug` returns one restaurant with its ordered menu
  categories and items.
- `GET /api/popular-restaurants` remains available for compatibility with the
  current homepage.

For production, run:

```bash
npm start
```

The server reads `PORT` from the environment and defaults to port `5001`.
