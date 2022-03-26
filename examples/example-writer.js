const path = require('path')
const CsvToFireStore = require('../src/lib/classes/csvtofirestore')

// Require as an npm package if installed using npm
// const { CsvToFireStore } = require('csv-firestore')

// MyCustomHandler extends CsvToFireStore and overrides its
// ParserCSV read() and end() methods
// to customize CSV output formatting other than CsvToFireStore's CSV read as is
class MyCustomHandler extends CsvToFireStore {
  constructor(csvFilePath) {
    super(csvFilePath)
    this.character_names = []
  }

  read (row) {
    // Read only the "name" column from the CSV
    this.character_names.push({
      name: row.name
    })
  }

  end () {
    console.log('Writing CSV file.')
    console.log(this.character_names)
    this.write(this.character_names, 'character_names.csv')
  }
}

// This example reads the sample CSV file, extracts its "name" column
// and writes it to a new CSV file "character_names.csv"
const main = async () => {
  const parser = new MyCustomHandler(path.resolve(__dirname, 'example.csv'))

  try {
    await parser.readCSV()
  } catch (err) {
    console.error(err.message)
  }

  await parser.firestoreUpload('testing', true, parser.character_nams)
  console.log('done')
}

main()
