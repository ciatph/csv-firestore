const fs = require('fs')
const csv = require('fast-csv')

/**
 * Parse the contents of a CSV file into an Object[] array
 */
class ParserCSV {
  /**
   * Initialize ParserCSV
   * @param {String} csvFilePath
   */
  constructor (csvFilePath) {
    // Array of Object[] key-value pairs to contain each CSV row
    this.csv_rows = []

    // Full CSV directory path
    this.csv_filepath = csvFilePath
  }

  /**
   * Write an array of simple key-value pair Object[] to CSV
   * @param {Object[]} collection - Array of Object[] (key-value pairs)
   * @param {String} filename - CSV filename
   */
  write (collection, filename) {
    const csvOut = fs.createWriteStream(filename)
    const csvStream = csv.format({ headers: true })
    csvStream.pipe(csvOut)

    collection.forEach((item, index) => {
      csvStream.write(item)
    })

    csvStream.end()
  }

  /**
   * Read the CSV file contents by row.
   * Store each row in this.csv_rows.
   * @param {Object} row - current CSV line/row read by fast-csv
   */
  read (row) {
    const headers = Object.keys(row)
    const obj = {}

    headers.forEach(item => {
      obj[item] = row[item]
    })

    this.csv_rows.push(obj)
  }

  /**
   * Start reading the CSV rows into this.csv_rows[]
   * Returns this.csv_rows[]
   * @returns {Object[]} - Object[] array of CSV rows transformed into key-value pairs
   */
  readCSV () {
    return new Promise((resolve, reject) => {
      fs.stat(this.csv_filepath, (err, stats) => {
        if (err) {
          reject(new Error(err.message))
        }

        if (stats) {
          fs.createReadStream(this.csv_filepath)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => {
              reject(error.message)
            })
            .on('data', row => this.read(row))
            .on('end', rowCount => {
              console.log(`processed ${rowCount} rows`)
              this.end()
              resolve(this.csv_rows)
            })
        }
      })
    })
  }

  /**
   * Get the read CSV data
   * @returns {Object[]} - Object[] array of CSV rows transformed into key-value pairs
   */
  data = () => this.csv_rows

  /**
   * end function after finishing reading the CSV file
   */
  end () {
    console.log('Ending CSV reading.')
  }
}

module.exports = ParserCSV
