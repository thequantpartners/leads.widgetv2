const router = require('express').Router()
const { requireSuperAdmin } = require('../middleware/auth')
const { db } = require('../firebase')

const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL

// GET /api/admin/users
router.get('/users', requireSuperAdmin, async (req, res) => {
  try {
    const snap = await db.collection('profiles').orderBy('createdAt', 'desc').get()
    res.json(snap.docs.map((d) => d.data()))
  } catch (err) {
    console.error('admin users error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/admin/users/:uid — upgrade/downgrade plan or block/unblock
router.patch('/users/:uid', requireSuperAdmin, async (req, res) => {
  const { uid } = req.params
  try {
    const ref = db.collection('profiles').doc(uid)
    const snap = await ref.get()
    if (!snap.exists) return res.status(404).json({ error: 'User not found' })

    const profile = snap.data()

    // Hard protection: superadmin cannot be modified
    if (profile.email === SUPERADMIN_EMAIL) {
      return res.status(403).json({ error: 'Cannot modify superadmin' })
    }

    const allowed = ['plan', 'status']
    const patch = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key]
    }

    if (!Object.keys(patch).length) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    const VALID_PLANS = ['free', 'pro', 'plus']
    const VALID_STATUS = ['active', 'blocked']
    if (patch.plan && !VALID_PLANS.includes(patch.plan)) {
      return res.status(400).json({ error: 'Invalid plan' })
    }
    if (patch.status && !VALID_STATUS.includes(patch.status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    await ref.update(patch)
    res.json({ ...profile, ...patch })
  } catch (err) {
    console.error('admin patch user error', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
