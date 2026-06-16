const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const { db } = require('../firebase')

// GET /api/dashboard — metrics for the logged-in user's widget
router.get('/', requireAuth, async (req, res) => {
  try {
    const widgetSnap = await db
      .collection('widgets')
      .where('ownerUid', '==', req.uid)
      .limit(1)
      .get()

    if (widgetSnap.empty) return res.json(emptyMetrics())

    const widgetId = widgetSnap.docs[0].id
    const eventsSnap = await db
      .collection('events')
      .where('widgetId', '==', widgetId)
      .get()

    const leadsSnap = await db
      .collection('leads')
      .where('widgetId', '==', widgetId)
      .get()

    const events = eventsSnap.docs.map((d) => d.data())
    const leads = leadsSnap.docs.map((d) => d.data())

    const viewed = events.filter((e) => e.event === 'viewed').length
    const engaged = leads.filter((l) => l.stage === 'engaged' || l.stage === 'paid').length
    const paid = leads.filter((l) => l.stage === 'paid').length

    res.json({
      viewed,
      engaged,
      paid,
      revenue: 0, // integrated via Stripe webhook in next step
      conversionRate: viewed > 0 ? paid / viewed : 0,
    })
  } catch (err) {
    console.error('dashboard error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/leads — leads list
router.get('/leads', requireAuth, async (req, res) => {
  try {
    const widgetSnap = await db
      .collection('widgets')
      .where('ownerUid', '==', req.uid)
      .limit(1)
      .get()

    if (widgetSnap.empty) return res.json([])

    const widgetId = widgetSnap.docs[0].id
    const snap = await db
      .collection('leads')
      .where('widgetId', '==', widgetId)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()

    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  } catch (err) {
    console.error('leads error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

function emptyMetrics() {
  return { viewed: 0, engaged: 0, paid: 0, revenue: 0, conversionRate: 0 }
}

module.exports = router
