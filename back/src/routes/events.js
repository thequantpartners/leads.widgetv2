const router = require('express').Router()
const { db } = require('../firebase')

// POST /api/events — tracking beacon (no auth, best-effort)
router.post('/', async (req, res) => {
  res.status(204).end()

  const { widgetId, event, section, data = {} } = req.body
  if (!widgetId || !event) return

  try {
    const widgetSnap = await db.collection('widgets').doc(widgetId).get()
    if (!widgetSnap.exists) return
    const cfg = widgetSnap.data()

    await db.collection('events').add({
      widgetId,
      ownerUid: cfg.ownerUid,
      event,
      section: section || null,
      data,
      createdAt: Date.now(),
    })

    // On payment click — update lead stage
    if (event === 'paid') {
      const leadsSnap = await db
        .collection('leads')
        .where('widgetId', '==', widgetId)
        .where('stage', '==', 'engaged')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get()

      if (!leadsSnap.empty) {
        await leadsSnap.docs[0].ref.update({ stage: 'paid', updatedAt: Date.now() })
      }
    }
  } catch {
    // non-critical
  }
})

module.exports = router
