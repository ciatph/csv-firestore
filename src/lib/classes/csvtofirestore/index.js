const ParserCSV = require('../parser')
const { uploadToCollection } = require('../firestore-data')

/**
 * Read the contents of a CSV file and
 * upload the CSV contents to a Firestore collection.
 */
class CsvToFirestore extends ParserCSV {
  /**
   * Full file path to the CSV file
   * @param {String} csvFilePath 
   */
  constructor (csvFilePath) {
    super(csvFilePath)
  }

  /**
   * Upload the internal CSV file contents to a Firestore collection.
   * The Firestore collection will be created if it does not yet exist.
   * @param {String} collectionName - Firestore collection name
   * @param {Boolean} overwrite - delete all documents in the collection before uploading data
   */
  async firestoreUpload (collectionName, overwrite = true) {
    await uploadToCollection(collectionName, this.data(), overwrite)
  }
}

module.exports = CsvToFirestore
