const CsvToFirestore = require('./lib/classes/csvtofirestore')
const prompt = require('./lib/utils/prompt')
const header = require('./lib/utils/header')

const main = async () => {
  let exit = false

  while (!exit) {
    // Prompt to ask for CSV file path
    process.stdout.write('\u001B[2J\u001B[0;0f')
    console.log(header('CSV FILE INPUT'))

    const csvfile = await prompt('\nEnter the full CSV file path: ')
    let csv = null

    if (csvfile) {
      try {
        console.log('Reading the CSV file...')
        csv = new CsvToFirestore(csvfile)
        await csv.readCSV()
      } catch (err) {
        console.log(`Error reading CSV: ${err.message}`)
      }

      if (csv.data().length > 0) {
        console.log(header('FIRESTORE COLLECTION UPLOAD'))
        const collectionName = await prompt('Enter Firestore collection name: ')

        if (collectionName) {
          const retain = await prompt('Warning: The script deletes all Firestore collection data by default before upload.\nRetain old data? [n/Y] (Press enter to proceed): ')
          console.log('Uploading CSV to Firestore...')

          try {
            await csv.firestoreUpload(collectionName, (retain !== 'Y'))
            console.log('Data uploaded.')
          } catch (err) {
            console.log(`Error uploading to Firestore: ${err.message}`)
          }
        }
      }
    }

    // Prompt to exit
    const ex = await prompt('\nExit? (Enter X to exit): ')
    exit = (ex === 'X')
  }

  console.log('Goodbye!')
  process.exit(0)
}

main()

