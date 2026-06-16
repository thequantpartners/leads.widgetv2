# PCA Index

## Project
Name: Signal — Behavior AI Widget
Type: SaaS (React frontend + Express backend)
Stage: MVP in development

## Active Objective
Build a proactive behavior AI widget that detects what section a visitor is viewing,
triggers contextual AI messages, offers payment links via Stripe, and feeds conversion
data back to Google Ads for audience enrichment.

## Architecture
- Frontend: React 19 + Vite 8 + TypeScript + Tailwind v4 (root dir) → deploys to Vercel
- Backend: Express (back/ folder) → deploys to Railway via Dockerfile
- Auth: Firebase Google-only auth
- DB: Firestore
- AI: OpenAI gpt-4o-mini
- Payments: Stripe
- Ads: Google Ads gtag conversions

## Superadmin
Email: thequantpartners@gmail.com
Protected at backend level — cannot be deleted or blocked via any API endpoint.

## Key Endpoints
POST /api/me — bootstrap user profile
GET|PATCH /api/widget — widget config
GET /w/:widgetId.js — public embed script
POST /api/chat — AI chat
POST /api/behavior/message — proactive AI bubble message
POST /api/events — tracking beacon
GET /api/dashboard — metrics
GET /api/leads — leads list
GET|PATCH /api/admin/users/:uid — superadmin user management

## Critical Runtime Rule
Do not read the entire PCA folder by default.

Canonical markdown files are the source of truth.
Vector memory is the mandatory access layer.
The agent must retrieve only task-relevant context before acting.

## Required Entry Flow
1. Read this file only.
2. Classify the task.
3. Use PCA retrieval.
4. Work with retrieved context.
5. Update memory only after confirmed completion.

## Core Files
- `pca/core/project-brief.md`
- `pca/core/product-context.md`
- `pca/core/architecture.md`
- `pca/core/stack.md`
- `pca/state/active-task.md`
- `pca/state/roadmap.md`
- `pca/state/changelog.md`
- `pca/state/active-decisions.md`
- `pca/visual/visual-index.md`

## Retrieval Limits
- Simple task: 3 chunks
- Normal task: 5 chunks
- Architecture task: 8 chunks
- Audit task: 10 chunks
- Visual task: 3 text chunks + 3 visual references

## Closure Policy
Only after explicit user confirmation with `SI`:
1. update roadmap
2. update changelog
3. update active decisions if needed
4. update ADR/PRD if needed
5. sync changed files to vector memory
