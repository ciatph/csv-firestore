require('dotenv').config()
const { initializeApp, getApps, getApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const admin = require('firebase-admin')

// Modular Singleton Firebase app initialization
if (!getApps().length) {
  if (process.env.FIREBASE_SERVICE_ACC === undefined || process.env.FIREBASE_PRIVATE_KEY === undefined) {
    console.log('FIREBASE_SERVICE_ACC or FIREBASE_PRIVATE_KEY is missing.')
    process.exit(1)
  }

  // Add double-quotes around the "private_key" JSON
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACC)
  serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')

  initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}

// Use existing app instance
const app = getApp()
const db = getFirestore(app)

module.exports = {
  admin,
  db
}
