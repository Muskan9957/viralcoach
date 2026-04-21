# AI Reel Coach — Backend API (MVP)

> **For the developer:** This is the complete MVP backend. Read this top to bottom before you start.

---

## What This Does

This is the server (backend) for AI Reel Coach. It handles:

| Feature | Endpoint |
|---|---|
| Register / Login | `POST /api/auth/register` · `POST /api/auth/login` |
| Generate a script | `POST /api/scripts/generate` |
| Score a hook | `POST /api/hooks/score` |
| Rewrite a weak hook | `POST /api/hooks/rewrite` |
| Analyze performance | `POST /api/performance/analyze` |
| Upgrade plan (Stripe) | `POST /api/payments/checkout` |
| Manage subscription | `POST /api/payments/portal` |

---

## Setup (Step by Step)

### 1. Install dependencies
```bash
cd ai-reel-coach
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Open .env and fill in all values (database, API keys, Stripe)
```

### 3. Set up the database
```bash
# Make sure PostgreSQL is running, then:
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the server
```bash
npm run dev    # development (auto-restarts on changes)
npm start      # production
```

### 5. Test it's working
```
GET http://localhost:4000/api/health
```
You should see: `{ "status": "ok", ... }`

---

## API Quick Reference

### Auth
```
POST /api/auth/register     { email, password, name? }
POST /api/auth/login        { email, password }
GET  /api/auth/me           [requires token]
```

### Scripts
```
POST /api/scripts/generate  { topic, niche?, tone? }   [requires token]
GET  /api/scripts           [requires token]
GET  /api/scripts/:id       [requires token]
```
**Tones available:** `educational` · `funny` · `motivational` · `storytelling` · `controversial` · `conversational`

### Hooks
```
POST /api/hooks/score          { hookText, scriptId? }        [requires token]
POST /api/hooks/rewrite        { scriptId, originalHook }     [requires token]
POST /api/hooks/rewrite/accept { rewriteId }                  [requires token]
GET  /api/hooks/history                                       [requires token]
```

### Performance
```
POST /api/performance/analyze  { topic, hookUsed, views, watchTimePercent, likes, shares, comments }
GET  /api/performance/history
GET  /api/performance/history/:id
```

### Payments
```
POST /api/payments/checkout  { plan: "STARTER" | "PRO" }   [requires token]
POST /api/payments/portal                                   [requires token]
POST /api/payments/webhook   [Stripe calls this — no token]
```

---

## Authentication

All protected routes require a `Bearer` token in the header:
```
Authorization: Bearer <token>
```
The token is returned when you register or log in.

---

## Plan Limits

| Plan | Monthly Script Generations |
|---|---|
| FREE | 5 |
| STARTER | 50 |
| PRO | Unlimited |

Hook scoring and performance analysis are **not counted** toward the limit.

---

## Project Structure

```
ai-reel-coach/
├── src/
│   ├── server.js              — starts the server
│   ├── app.js                 — Express setup, routes mounted here
│   ├── config/
│   │   └── prisma.js          — database client
│   ├── middleware/
│   │   ├── auth.js            — JWT protection
│   │   ├── rateLimiter.js     — IP-based rate limiting
│   │   └── errorHandler.js    — global error handler
│   ├── routes/                — URL definitions
│   ├── controllers/           — request/response logic
│   └── services/
│       ├── aiService.js       — all Claude AI calls
│       ├── planService.js     — free tier enforcement
│       └── stripeService.js   — payment logic
├── prisma/
│   └── schema.prisma          — database tables
├── .env.example               — copy this to .env
└── package.json
```

---

## Stripe Setup (Payments)

1. Create an account at [stripe.com](https://stripe.com)
2. Go to **Products** → create two products: `Starter ($10/mo)` and `Pro ($29/mo)`
3. Copy the **Price IDs** into your `.env` file
4. For local testing, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
```bash
stripe listen --forward-to localhost:4000/api/payments/webhook
```
This gives you a webhook secret to put in `.env`.

---

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM
- **AI:** Anthropic Claude API
- **Payments:** Stripe
- **Auth:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, Rate Limiting, bcrypt
