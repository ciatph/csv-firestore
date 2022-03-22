const FirestoreData = require('./firestore-data')
const FD = new FirestoreData()

const deleteCollection = FD.deleteCollection.bind(FD)
const uploadToCollection = FD.uploadToCollection.bind(FD)
const fieldNameExists = FD.fieldNameExists.bind(FD)

module.exports = {
  deleteCollection,
  uploadToCollection,
  fieldNameExists
}
