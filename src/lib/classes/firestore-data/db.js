require('dotenv').config()
const admin = require('firebase-admin')
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACC)

// Add double-quotes around the "private_key" JSON
serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  // databaseURL: process.env.FIREBASE_DB_URL
})

const db = admin.firestore()

module.exports = {
  db,
  admin
}
