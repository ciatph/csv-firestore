require('dotenv').config()
const ParserCSV = require('./src/lib/classes/parser')
const FirestoreData = require('./src/lib/classes/firestore-data/firestore-data')
const CsvToFireStore = require('./src/lib/classes/csvtofirestore')
const FirebaseDB = require('./src/lib/classes/firebasedb')

module.exports = {
  CsvToFireStore,
  ParserCSV,
  FirestoreData,
  FirebaseDB
}
