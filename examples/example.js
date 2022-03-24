const path = require('path')
const CsvToFireStore = require('../src/lib/classes/csvtofirestore')

// Require as an npm package if installed using npm
// const CsvToFireStore = require('csv-firestore')

// Basic CsvToFireStore usage.
// Read CSV file as is and upload to a Firestore collection.
const main = async () => {
  const handler = new CsvToFireStore(path.resolve(__dirname, 'example.csv'))

  try {
    await handler.readCSV()
  } catch (err) {
    console.log(err.message)
  }

  if (handler.data().length > 0) {
    try {
      await handler.firestoreUpload('my_firestore_collection')
      console.log('Data uploaded.')
    } catch (err) {
      console.log(err.message)
    }
  }
}

main()
