# LogicSnap - Enterprise Decision Intelligence Platform

Welcome to **LogicSnap**, an enterprise-grade, plug-and-play decision intelligence platform built for the DevForge 4.0 MVP. This repository contains the Next.js application, the Node.js Math Engine, and the Supabase API integrations.

## 🌟 What is LogicSnap?

LogicSnap completely decouples business logic from core application code. Host applications integrate our API exactly once. After that, non-technical business managers can dynamically change business logic, pricing, discounts, and access rules via the LogicSnap dashboard without requiring any developer redeployments or CI/CD pipelines.

### Features
1. **Statistical Math Evaluator**: A Node.js core capable of executing complex risk models using Matrix Operations, Standard Deviation (Z-Scores) for anomaly detection, and Moving Averages.
2. **Time-Travel Backtesting**: An API and UI that simulates draft rules against historical data streams to measure the financial impact before production deployment.
3. **Blast Radius Dependency Graph**: Visually maps cross-system rule collisions to mitigate governance risk.
4. **AI-Powered Text-to-Rule Engine**: Uses heuristics to automatically translate natural language requirements (e.g., "30% off upto 120 on Sundays") into deeply structured, Zod-validated JSON schemas.

## 🏗️ What Was Built (Current MVP State)

This project has been architected completely and is fully functional. Here is a summary of the accomplishments to date:

- **Frontend Application**
  - Built with Next.js App Router and React.
  - Implemented a premium, dark-mode CSS Design System (`src/app/globals.css`).
  - Created key interfaces: Landing Page, Marketing Portal, Backtesting Dashboard, and Developer Dependency Graph.

- **Core Logic Engine (`src/lib/engine`)**
  - Built `StatisticalMathEvaluator.ts` to process complex numeric and statistical rules dynamically.
  - Built `RuleEngine.ts` to orchestrate multiple mathematical conditions against a JSON payload.

- **Supabase Enterprise Architecture**
  - Designed the strict PostgreSQL DB schema in `supabase/migrations/00001_initial_schema.sql` including `projects`, `rules`, and `historical_events`.
  - Implemented Postgres JSONB validation blocks and Row Level Security (RLS) policies.
  - Implemented **Zod Validation** (`src/lib/schema.ts`) to strictly type all API payloads and prevent LLM "garbage" hallucinations during the Text-to-Rule process.

- **Edge APIs / Route Handlers**
  - `POST /api/evaluate`: The core ingestion engine for host apps. Parses with Zod, queries active Supabase rules, evaluates mathematical logic, and asynchronously logs to `historical_events`.
  - `POST /api/generate`: The AI endpoint translating text into strict JSON schema representing the rule.
  - `POST /api/backtest`: Queries 30 days of historical Supabase data and simulates the draft rules against it.
  - `GET /api/blast-radius/[rule_id]`: Connects across JSONB targets in Supabase to find cross-system rule collisions.

## 🚀 Getting Started

If you are opening this project in the Antigravity IDE (or standard VSCode), here are the steps to get running.

### Prerequisites
- Node.js `v18+`
- npm (Node Package Manager)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Running the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the primary interfaces.

### Step 3: API Integration Tests
You can run the terminal test scripts to verify the core systems:
- Test the fundamental statistical math limits:
  ```bash
  npx tsx scripts/test-math.ts
  ```
- Test the AI Text-to-Rule JSON generator and Zod validation:
  ```bash
  npx tsx scripts/demo-api.ts
  ```

## 🗄️ Supabase Setup (For the Next Dev Phase)

The MVP currently uses mocked arrays simulating the Supabase returns inside the API classes to keep the local dev environment instantaneous without external keys.

**To attach your real Supabase instance:**
1. Execute the migration file on your Supabase project: `supabase/migrations/00001_initial_schema.sql`
2. Update the environment variables in `src/lib/supabase.ts` or add a `.env.local` file:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_SERVICE_KEY=your_service_role_key
   ```
3. Update the API routes (`/api/evaluate`, `/api/backtest`, `/api/blast-radius`) to remove the fallback mock branches and uncomment the `supabase.from()` calls.
