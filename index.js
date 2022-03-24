require('dotenv').config()
const ParserCSV = require('./src/lib/classes/parser')
const FirestoreData = require('./src/lib/classes/firestore-data')
const CsvToFireStore = require('./src/lib/classes/CsvToFireStore')

module.exports = {
  CsvToFireStore,
  ParserCSV,
  FirestoreData
}
