const FirebaseDB = require('../firebasedb')

/**
 * A wrapper around firebase-admin for bulk delete and write data operations to specified Firestore collections.
 * Initializes and keeps a `firestore` and `admin` Singleton reference from firebase-admin for data access.
 * Uses firebase-admin v13.1.0.
 * Requires a privileged environment to run using the project's
 *    service account JSON credentials (see .env file)
 */
class FirestoreData extends FirebaseDB {
  /**
   * Delete a firestore collection including all its documents
   * @param {String} collectionName - firestore collection name
   */
  async deleteCollection (collectionName) {
    const collectionRef = this.db.collection(collectionName)
    const query = collectionRef.offset(0)
    // const query = collectionRef.orderBy(fieldName)

    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, resolve)
    })
  }

  /**
   * Delete a firestore document by batch
   * @param query - firestore collection query object
   * @param resolve - Promise.resolve from a calling function
   */
  async deleteQueryBatch (query, resolve) {
    const snapshot = await query.get()
    const batchSize = snapshot.size

    // No documents left
    if (batchSize === 0) {
      resolve()
      return
    }

    // Delete documents in a batch
    const batch = this.db.batch()
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      this.deleteQueryBatch(query, resolve)
    })
  }

  /**
   * Upload data to a firestore collection
   * @param {String} collectionName - firestore collection name
   * @param {Object[]} data - Array of objects (1 level only)
   * @param {Boolean} overwrite - delete all documents in the collection before uploading data
   */
  async uploadToCollection (collectionName, data, overwrite = true) {
    const batch = this.db.batch()

    if (overwrite) {
      await this.deleteCollection(collectionName)
    }

    data.forEach((item, index) => {
      const docRef = this.db.collection(collectionName).doc()
      batch.set(docRef, item)
    })

    await batch.commit()
  }

  /**
   * Check if a field name exists in a Firestore document
   * @param {String} collectionName - firestore collection name
   * @param {String} fieldName - field name in the firestore collection's document
   * @returns {Boolean} true|false
   */
  async fieldNameExists (collectionName, fieldName) {
    const collectionRef = this.db.collection(collectionName)
    const query = collectionRef.orderBy(fieldName).limit(1)

    try {
      const snapshot = await query.get()
      return (snapshot.docs.length === 1)
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

module.exports = FirestoreData
