## csv-firestore

**csv-firestore**, a NodeJS script meant to run in a privileged environment, will upload the contents of a CSV file into a Firestore collection. The uploaded data will be accessible to Firebase web clients or via the Firestore REST API, following the project's Firestore Rules definition.

For example, a CSV file containing the items:

| server  | region   | element | name    |
|---------|----------|---------|---------|
| asia    | mondstat | electro | razor   |
| asia    | liyue    | cryo    | ganyu   |
| america | liyue    | geo     | zhongli |

Will be stored in a Firestore collection `playable_characters`, where each CSV row will be transformed into a Firestore document:

```
.
├── playable_characters
│   ├── 082gt7UJHkFm8kcgXYRj
|   ├───── server: asia
|   ├───── region: mondstat
|   ├───── element: electro
|   └───── name: razor
|   |
│   ├── 0dTehs7Vq0wrmMLw0lwy
|   ├───── server: asia
|   ├───── region: liyue
|   ├───── element: cryo
|   └───── name: ganyu
|   |
│   |── 1h4my1GwNPBcDeLhsLwZ
|   ├───── server: asia
|   ├───── region: liyue
|   ├───── element: geo
|   └───── name: zhongli
...
```

## Content

- [Introduction](#csv-firestore)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Interactive Mode](#interactive-mode)
  - [NPM Package/Class](#npm-package/class)
  - [Customizing the CSV Output](#customizing-the-csv-output)
- [Output](#output)

## Requirements

The following dependencies are used for this project. Feel free to use other dependency versions as needed.

1. Windows, Mac or Linux OS
2. NodeJS version 16.14.2
3. Access to a Firebase Project [[link]](https://firebase.google.com/)
   - Pricing Plan: Spark plan or higher
   - Service account credentials JSON file
   - Firestore: configured using the default Test mode Rules, or a custom rules set. See below for reference to a Firestore Rules that blocks all writes and allows public reads.  
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow write: if false;
           allow read;
         }
       }
     }
     ```


### Core Libraries and Frameworks

(See package.json for more information.)

1. [firebase-admin](https://www.npmjs.com/package/firebase-admin) v11.0.1
2. [fast-csv](https://www.npmjs.com/package/fast-csv) v4.3.6


## Installation

1. Clone this repository, or install using npm (see step #2).  
`git clone https://github.com/ciatph/csv-firestore.git`
2. **csv-firestore** is also available as an [npm package](https://www.npmjs.com/package/csv-firestore). Install using:  
`npm install --save csv-firestore`
3. Install dependencies.  
`npm install`
4. Set up the environment variables. Create a `.env` file with reference to the `.env.example` file. Encode your own Firebase project settings on the following variables:
   -  `FIREBASE_SERVICE_ACC`
      -  The project's private key file contents, condensed into one line and minus all whitespace characters.
      -  The service account JSON file is generated from the Firebase project's **Project Settings** page, on  
        **Project Settings** -> **Service accounts** -> **Generate new private key**
   - `FIREBASE_PRIVATE_KEY`
      - The `private_key` entry from the service account JSON file
      - Take note to make sure that the value starts and ends with a double-quote


## Usage

### Interactive Mode

1. Run `npm start` to start the interactive session.
2. Run `node .\node_modules\csv-firestore\src\index.js` if installed via npm.

Answer the questions appropriately when prompted:

- **Enter the full CSV file path:** 
   - *(Enter the full file path to the input CSV file i.e., D:/MyFiles/users.csv)*
- **Enter Firestore collection name:**
   - *(Enter a target Firestore collection)*
   -  The specified Firestore collection will be created if it does not yet exist.
- **Retain old data? [n/Y] (Press enter to proceed):**
   -  **csv-firestore** DELETES a collection's documents by default before proceeding to upload data.
   -  *(Press ENTER)* to accept the default behavior - delete the collection's documents before uploading data.
   -  *(Type Y and press ENTER)* to retain all documents.

Wait for the data upload to finish.


### NPM Package/Class

- Require **csv-firestore** as an npm package: `require('csv-firestore')` if it's installed using **npm**, or  
- Require the **CsvToFireStore** class from `./lib/classes/csvtofirestore`` into a script if it's installed outside npm. See example usage below:

```
// examples/example.js
const path = require('path')
const CsvToFireStore = require('../src/lib/classes/csvtofirestore')

// Require as an npm package if installed using npm
// const { CsvToFireStore } = require('csv-firestore')

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
```

### Customizing the CSV Output

**csv-firestore** reads all CSV content as is and uploads it to Firestore. The following examples show how to customize **csv-firestore**'s CSV content by overriding it's (extends) **ParserCSV** class.

#### Override CsvToFireStore's CSV content Directly

```
// examples/example-parser.js
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
```
   
#### Write Formatted CSV Content Into a New CSV File

This method writes formatted CSV content to a new CSV file that can read by **CsvToFireStore** descibed on the [Interactive Mode](#interactive-mode) or [NPM Package/Class](#npm-package/class) usage methods.

```
// examples/example-writer.js
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
    console.log('end')
    console.log(this.character_names)
  }
}

// This example reads the sample CSV file, extracts its "name" column
// and writes it to a new CSV file "character_names.csv"
const main = async () => {
  const parser = new MyCustomHandler(path.resolve(__dirname, 'example.csv'))

  try {
    await parser.readCSV()
    parser.write(parser.character_names, 'character_names.csv')
  } catch (err) {
    console.error(err.message)
  }

  // Upload the custom CSV content to Firestore
  try {
    parser.firestoreUpload('my_firestore_collection', true, parser.character_names)
  } catch (err) {
    console.error(err.message)
  }
}

main()
```

> **NOTE:** We can also extend the **ParserCSV** class instead of **CsvToFireStore** for reading and writing CSV files. Note however that **ParserCSV** does not include methods for uploading data to Firestore.

- Require **csv-firestore**'s **ParserCSV** as an npm package:  
`const { ParserCSV } = require('csv-firestore')` if it's installed using **npm**, or  
- Require the **ParserCSV** class from `./lib/classes/parsercsv` into a script if it's installed outside npm. See example usage below:


## Output

The uploaded data will be available on Firestore. It will be accessible using various [Firebase clients](https://firebase.google.com/docs/firestore/manage-data/add-data) for web, (JS) Python, PHP, Go, and many more.

It can also be accessed from Firestore's REST API following the pattern below if public reads are allowed on the Firestore Rules. 
`https://firestore.googleapis.com/v1/projects/<PROJECT_ID_HERE>/databases/(default)/documents/<COLLECTION_NAME>?&key=<FIREBASE_CONFIG_API_KEY>`