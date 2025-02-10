require('dotenv').config()
const { initializeApp, getApps, getApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const admin = require('firebase-admin')

/**
 * @class FirebaseDB
 * @description Class that provides a Singleton instance of the Firebase `admin` and `firestore` database objects
 * initialized using the service account credentials in the `.env` file. It also displays relevant firebase-admin
 * and Firestore database information.
 */
class FirebaseDB {
  /**
   * csv-firestore internal Firebase admin namespace
   * @type {object}
   */
  #admin

  /**
   * Firestore database object namespace, containing methods for
   * interfacing with the Firestore database.
   * @type {object}
   */
  #db

  /**
   * Initialized Fireabase app name
   * @type {string}
   */
  #appName

  /**
   * Minimal Firestore database details (also available in `#db`)
   * @type {object}
   */
  #dbSettings = {
    /**
     * Firestore database ID (name)
     * @type {string}
     */
    databaseId: null,
    /**
     * Firestore project ID
     * @type {string}
     */
    projectId: null
  }

  /**
   * Version of the firebase-admin package that created the `#admin` and firestore `#db` Singletons
   * @type {string}
   */
  #sdkVersion

  /**
   * Creates an instance of the `FirebaseDB` class and intializes or uses and existing
   * Firebase `admin` and `firestore` database Singleton using the firebase-admin
   * `getApp()` and `getApps()` functions.
   * @constructor
   */
  constructor () {
    this.initialize()
  }

  /**
   * Initializes the Firebase `admin` and Firestore `database` using the Firebase credentials in the `.env` file.
   * Ensures Singleton Firebase app instances by checking initialized Firebase apps using the `getApps()` and `getApp()`
   * firebase-admin functions.
   * @param {string} [appName] (Optional) Firebase app name to tag a Firebase app instance.
   * @returns {void}
   */
  initialize () {
    const appsLength = getApps().length

    if (!appsLength) {
      if (process.env.FIREBASE_SERVICE_ACC === undefined || process.env.FIREBASE_PRIVATE_KEY === undefined) {
        console.log('FIREBASE_SERVICE_ACC or FIREBASE_PRIVATE_KEY is missing.')
        process.exit(1)
      }

      // Add double-quotes around the "private_key" JSON
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACC)
      serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')

      // Initialize a "[DEFAULT]" Firebase app
      // Developers expect only one (1) app instance per firebase-admin version
      initializeApp({
        credential: admin.credential.cert(serviceAccount)
      })
    }

    // Use existing app instance
    const app = getApp()

    this.#db = getFirestore(app)
    this.#admin = admin
    this.#appName = app.name
    this.#sdkVersion = admin.SDK_VERSION

    this.#dbSettings = {
      databaseId: this.#db.databaseId,
      projectId: this.#db.projectId
    }
  }

  /**
   * Prints relevant firebase-admin (firestore, app) information to screen.
   * @returns {void}
   */
  log () {
    let log = `Firebase app name: ${this.#appName}\n`
    log += `Firestore database ID: ${this.#dbSettings.databaseId}\n`
    log += `Firestore project ID: ${this.#dbSettings.projectId}\n`
    log += `SDK Version: ${this.sdkVersion}`

    console.log(log)
  }

  /**
   * Firestore admin getter
   * @returns {object} Inialized Firebase admin object namespace
   */
  get admin () {
    return this.#admin
  }

  /**
   * Firestore database getter
   * @returns {object} Inialized Firestore database object
   */
  get db () {
    return this.#db
  }

  /**
   * Firebase app name getter
   * @returns {string} Initialized Firebase app name
   */
  get appName () {
    return this.#appName
  }

  /**
   * firebase-admin SDK version getter
   * @returns {string} firebase-admin SDK version
   */
  get sdkVersion () {
    return this.#sdkVersion
  }

  /**
   * Firestore database settings getter
   * @returns {object} Minimal Firestore database settings object
   */
  get dbSettings () {
    return this.#dbSettings
  }
}

module.exports = FirebaseDB
