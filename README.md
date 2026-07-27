# dostavi.me API

Express REST API for the dostavi.me food delivery application.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

The health check is available at `GET /health`.

For production, run:

```bash
npm start
```

The server reads `PORT` from the environment and defaults to port `3000`.
