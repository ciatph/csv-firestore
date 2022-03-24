const ParserCSV = require('../parser')
const { uploadToCollection } = require('../firestore-data')

/**
 * Read the contents of a CSV file and
 * upload the CSV contents to a Firestore collection.
 */
class CsvToFireStore extends ParserCSV {
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
   * @param {Object[]} data - Array of objects (1 level only) to upload
   */
  async firestoreUpload (collectionName, overwrite = true, data = []) {
    const dataToUpload = (data && data.length > 0)
      ? data
      : this.data()
    await uploadToCollection(collectionName, dataToUpload, overwrite)
  }
}

module.exports = CsvToFireStore
