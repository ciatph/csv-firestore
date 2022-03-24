const path = require('path')
const CsvToFireStore = require('../src/lib/classes/csvtofirestore')

// Require as an npm package if installed using npm
// const { CsvToFireStore } = require('csv-firestore')

const main = async () => {
  const handler = new CsvToFireStore(path.resolve(__dirname, 'example.csv'))

   // Directly override CsvToFireStore's ParserCSV read() method
   // and csv_rows[] {Object[]} array to include only the "name" column 
   // during Firestore upload
  handler.read = (row) => {
    handler.csv_rows.push({
      name: row.name
    })
  }

  try {
    await handler.readCSV()
  } catch (err) {
    console.error(err.message)
  }

  try {
    await handler.firestoreUpload('my_firestore_collection')
    console.log('Data uploaded')
  } catch (err) {
    console.error(err.message)
  }
}

main()
