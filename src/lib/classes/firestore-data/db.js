require('dotenv').config()
const admin = require('firebase-admin')
let db

if (process.env.FIREBASE_SERVICE_ACC === undefined || process.env.FIREBASE_PRIVATE_KEY === undefined) {
  console.log('FIREBASE_SERVICE_ACC or FIREBASE_PRIVATE_KEY is missing.')
  process.exit(1)
} else {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACC)

  // Add double-quotes around the "private_key" JSON
  serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: process.env.FIREBASE_DB_URL
  })

  db = admin.firestore()
}

module.exports = {
  db,
  admin
}
