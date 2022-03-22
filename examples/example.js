const path = require('path')
const CsvToFireStore = require('../index')

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
