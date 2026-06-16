const { admin } = require('../firebase')

async function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const decoded = await admin.auth().verifyIdToken(header.slice(7))
    req.uid = decoded.uid
    req.email = decoded.email
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

async function requireSuperAdmin(req, res, next) {
  await requireAuth(req, res, async () => {
    if (req.email !== process.env.SUPERADMIN_EMAIL) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  })
}

module.exports = { requireAuth, requireSuperAdmin }
