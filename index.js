require('dotenv').config()

if (!process.env.FIREBASE_SERVICE_ACC || !process.env.FIREBASE_PRIVATE_KEY) {
  console.log('FIREBASE_SERVICE_ACC or FIREBASE_PRIVATE_KEY is missing.')
  process.exit(1)
}

const CsvToFirestore = require('./src/lib/classes/csvtofirestore')

module.exports = CsvToFirestore
