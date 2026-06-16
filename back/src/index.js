require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173']

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        cb(null, true)
      } else {
        cb(new Error('CORS not allowed'))
      }
    },
    credentials: true,
  })
)

app.use(express.json())

// ── HEALTH ────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ ok: true }))

// ── ROUTES ────────────────────────────────────────────────────
const meRouter = require('./routes/me')
const { router: widgetRouter, serveScript } = require('./routes/widget')
const chatRouter = require('./routes/chat')
const eventsRouter = require('./routes/events')
const dashboardRouter = require('./routes/dashboard')
const adminRouter = require('./routes/admin')

// User bootstrap
app.use('/api/me', meRouter)

// Widget config (authenticated CRUD)
app.use('/api/widget', widgetRouter)

// Widget embed script — public, served directly from backend to any website
app.get('/w/:widgetId.js', serveScript)

// AI chat
app.use('/api/chat', chatRouter)

// Behavior AI message — chatRouter exposes POST /message here
app.use('/api/behavior', chatRouter)

// Event tracking (beacon, no auth)
app.use('/api/events', eventsRouter)

// Dashboard metrics
app.use('/api/dashboard', dashboardRouter)

// Leads list alias
app.get('/api/leads', (req, res, next) => {
  req.url = '/leads'
  dashboardRouter(req, res, next)
})

// Superadmin
app.use('/api/admin', adminRouter)

// ── START ────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Signal backend on :${PORT}`))
