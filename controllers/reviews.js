const moment = require("moment")

const model = require("../models/reviews")

exports.dailyReport = {
  // Average review's star of the day
  getAvgStarOfReview: async function (date) {
    const minTimestamp = moment(date).subtract(1, "days").toDate()
    const maxTimestamp = moment(date).add(1, "days").toDate()
    return await model.aggregate([
      { $match: { updatedAt: { $gte: minTimestamp, $lt: maxTimestamp } } },
      { $project: { rating: 1 } },
      { $group: { _id: null, data: { $avg: "$rating" } } }
    ])
  }
}
