require('dotenv').config()
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const admin = require('firebase-admin')
let db

if (process.env.FIREBASE_SERVICE_ACC === undefined || process.env.FIREBASE_PRIVATE_KEY === undefined) {
  console.log('FIREBASE_SERVICE_ACC or FIREBASE_PRIVATE_KEY is missing.')
  process.exit(1)
} else {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACC)

  // Add double-quotes around the "private_key" JSON
  // serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY
  serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')

  initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: process.env.FIREBASE_DB_URL
  })

  db = getFirestore()
}

module.exports = {
  db,
  admin
}
