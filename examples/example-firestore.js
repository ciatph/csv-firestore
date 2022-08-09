const { FirestoreData } = require('../index')

// Demonstrates custom Firestore queries
// with direct usage of firebase-admin's firestore and admin objects
const main = async () => {
  const Firestore = new FirestoreData()

  try {
    const firestoreCollection = 'my_books_collection'
    const id = Firestore.db.collection(firestoreCollection).doc().id

    const logs = await Firestore.db
      .collection(firestoreCollection)
      .doc(id)
      .set({
        id,
        title: 'My Favorite Book',
        date_created: Firestore.admin.firestore.Timestamp.now()
      })
    console.log(logs)
  } catch (err) {
    console.log(err.message)
  }
}

main()
