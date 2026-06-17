const admin = require('firebase-admin')

if (!admin.apps.length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw || raw === '{}') {
    console.warn('[firebase] FIREBASE_SERVICE_ACCOUNT not set — Firestore calls will fail')
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || 'signal-dev' })
  } else {
    const sa = JSON.parse(raw)
    admin.initializeApp({ credential: admin.credential.cert(sa) })
  }
}

const db = admin.firestore()

module.exports = { admin, db }
