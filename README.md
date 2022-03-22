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
- [Output](#output)

## Requirements

1. Windows, Mac or Linux OS
2. NodeJS version 14.18.3 or higher
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

1. [firebase-admin](https://www.npmjs.com/package/firebase-admin) v10.0.2
2. [fast-csv](https://www.npmjs.com/package/fast-csv) v4.3.6


## Installation

1. Clone this repository.  
`git clone https://github.com/ciatph/csv-firestore.git`
2. Install dependencies.  
`npm install`
3. Set up the environment variables.
   - Create a `.env` file with reference to the `.env.example` file.
   - Encode your own Firebase project settings on the following variables:
     -  `FIREBASE_SERVICE_ACC`
        -  The project's private key file contents, condensed into one line and minus alll whitespace characters.
        -  The service account JSON file is generated from the Firebase project's **Project Settings** page, on  
           **Project Settings** -> **Service accounts** -> **Generate new private key**
     - `FIREBASE_PRIVATE_KEY`
        - The `private_key` entry from the service account JSON file
        - Take note to make sure that the value starts and ends with a double-quote
4. (OPTIONAL) **csv-firestore** is also available as an npm package on https://www.npmjs.com/package/csv-firestore.  
   - `npm install --save csv-firebase`


## Usage

### Interactive Mode

Run `npm start` to start the interactive session. Answer the questions appropriately when prompted:

- **Enter the full CSV file path:** 
   - *(Enter the full file path to the input CSV file i.e., D:/MyFiles/users.csv)*
- **Enter Firestore collection name:**
   - *(Enter a target Firestore collection)*
   -  The specified Firestore collection will be created if it does not yet exist.
- **Retain old data? [n/Y] (Press enter to proceed):**
   -  **csv-firestore** DELETES a collection's documents by default before proceeding to upload data.
   -  *(Press ENTER)* to accept the default behavior - delete the collection's documents uploading data.
   -  *(Type Y and press ENTER)* to retain all documents.

Wait for the data upload to finish.


### NPM Package/Class

Require **csv-firestore** as an npm package: `require('csv-firestore')` if it's installed using **npm**, or  
require the **CsvToFirestore** class from `./lib/classes/csvtofirestore` into a script if it's installed outside npm. See example usage below:

```
// examples/example.js
const path = require('path')
const CsvToFireStore = require('../src/lib/classes/csvtofirestore')

// Require as an npm package if installed using npm
// const CsvToFireStore = require('csv-firestore')

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

Require as an npm package, if installed using `npm 

## Output

The uploaded data will be available on Firestore. It will be accessible using various [Firebase clients](https://firebase.google.com/docs/firestore/manage-data/add-data) for web, (JS) Python, PHP, Go, and many more.

It can also be accessed from Firestore's REST API following the pattern below if public reads are allowed on the Firestore Rules. 
`https://firestore.googleapis.com/v1/projects/<PROJECT_ID_HERE>/databases/(default)/documents/<COLLECTION_NAME>?&key=<FIREBASE_CONFIG_API_KEY>`