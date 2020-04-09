const { google } = require("googleapis")
const { SHEET_CLIENT_EMAIL, SHEET_PRIVATE_KEY } = process.env

const scopes = ["https://www.googleapis.com/auth/spreadsheets"]
const googleSheet = {
  gsapi: null,
  connect() {
    // Create client's credential object
    const client = new google.auth.JWT(
      SHEET_CLIENT_EMAIL,
      null,
      SHEET_PRIVATE_KEY,
      scopes
    )

    // Get BEARER token for client's credential
    client.authorize(function (err) {
      if (err) {
        console.log("Fail to authorize Google Sheet\n", err.message)
        return
      }
      console.log("🍣 Great! Connected to GoogleSheet API")
    })

    // Use client's credential included BEARER token
    this.gsapi = google.sheets({
      version: "v4",
      auth: client
    })
  }
}

module.exports = googleSheet.connect
