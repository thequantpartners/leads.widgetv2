const router = require('express').Router()
const { requireAuth } = require('../middleware/auth')
const { db } = require('../firebase')

const SUPERADMIN = process.env.SUPERADMIN_EMAIL

// POST /api/me — bootstrap or return existing profile
router.post('/', requireAuth, async (req, res) => {
  try {
    const ref = db.collection('profiles').doc(req.uid)
    const snap = await ref.get()

    if (snap.exists) {
      return res.json(snap.data())
    }

    const profile = {
      uid: req.uid,
      email: req.email,
      name: req.body.name || req.email.split('@')[0],
      photoURL: req.body.photoURL || null,
      role: req.email === SUPERADMIN ? 'superadmin' : 'client',
      plan: 'free',
      status: 'active',
      createdAt: Date.now(),
    }

    await ref.set(profile)

    // Create default empty widget config for new users
    const widgetRef = db.collection('widgets').doc()
    await widgetRef.set({
      id: widgetRef.id,
      ownerUid: req.uid,
      businessName: '',
      niche: '',
      tone: 'cercano y directo',
      agentName: 'Asistente',
      accentColor: '#c9f24a',
      welcomeMessage: 'Hola, ¿en qué te puedo ayudar?',
      paymentLink: '',
      googleAdsId: null,
      conversionLabel: null,
      behaviorRules: [],
      active: false,
      createdAt: Date.now(),
    })

    res.json(profile)
  } catch (err) {
    console.error('me error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
