const path = require('path')
const CsvToFireStore = require('./lib/classes/csvtofirestore')

const main = async () => {
  const handler = new CsvToFireStore(path.resolve(__dirname, 'example.csv'))

  try {
    await handler.readCSV()
    console.log(handler.data())
  } catch (err) {
    console.log(err.message)
  }

  if (handler.data().length > 0) {
    try {
      await handler.firestoreUpload('my_firestore_collection')
      console.log('done')
    } catch (err) {
      console.log(err.message)
    }
  }
}

main()
