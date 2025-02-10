const ParserCSV = require('../parser')
const FirestoreData = require('../firestore-data/firestore-data')

/**
 * Class that reads the contents of a CSV file and
 * uploads the CSV contents to a Firestore collection.
 */
class CsvToFireStore extends ParserCSV {
  /**
   * `FirestoreData` class instance containing methods for managing Firestore data.
   * It also contains internal Firebase `admin` and `firestore` Singletons.
   * @type {object}
   */
  #firestore

  constructor (csvFilePath) {
    super(csvFilePath)
    this.#firestore = new FirestoreData()
  }

  /**
   * Uploads the internal CSV file contents, or external data that resembles `ParserCSV`'s
   * JSON Object[] array structure to a Firestore collection, creating the Firestore
   * collection if it does not yet exist.
   * @param {String} collectionName - Firestore collection name
   * @param {Boolean} overwrite - Flag to delete all documents in the collection before uploading data
   * @param {Object[]} data - Array of objects (1 level only) to upload
   */
  async firestoreUpload (collectionName, overwrite = true, data = []) {
    const dataToUpload = (data && data.length > 0)
      ? data
      : this.data()

    await this.#firestore.uploadToCollection(collectionName, dataToUpload, overwrite)
  }
}

module.exports = CsvToFireStore
