const moment = require("moment")
var CronJob = require("cron").CronJob

const gsapi = require("../utils/googleapis") // Setup Google Spreadsheet
const reviewsCtl = require("../controllers/reviews") // Reviews controller

// ------ Setup codes ------
function reportToSheet(values) {
  gsapi.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "daily!A2",
    valueInputOption: "USER_ENTERED",
    requestBody: { values }
  })
}

// ------ Your code start here ------
module.exports = async function () {
  try {
    const avgStarOfReview = await reviewsCtl.dailyReport.getAvgStarOfReview(
      new Date(2020, 02, 28)
    )

    const reportData = [
      [
        moment(new Date()).format("L").toString(), // Column: Date
        avgStarOfReview[0] ? avgStarOfReview[0].data : "error" // Column: Average Review Star
      ]
    ]

    // Cronjon will run each minute
    new CronJob(
      "* * * * *",
      function () {
        reportToSheet(reportData)
      },
      null,
      true,
      "Asia/Ho_Chi_Minh"
    )
  } catch (err) {
    console.log(err.message)
  }
}
