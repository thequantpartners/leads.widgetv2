const admin = require('firebase-admin')

if (!admin.apps.length) {
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')
  admin.initializeApp({ credential: admin.credential.cert(sa) })
}

const db = admin.firestore()

module.exports = { admin, db }
