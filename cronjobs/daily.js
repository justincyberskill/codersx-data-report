import moment from 'moment';

import modelReviews from '../models/reviews';
import agenda from '../utils/agenda';
import { appendDataToSheet } from '../utils/googleapis';

// ------ Mongoose models interations with database ------
const models = {
  // Average review's star of the day
  getAvgStarOfReview: async (date) => {
    const minTimestamp = moment(date).subtract(1, 'days').toDate();
    const maxTimestamp = moment(date).add(1, 'days').toDate();
    const data = await modelReviews.aggregate([
      { $match: { updatedAt: { $gte: minTimestamp, $lt: maxTimestamp } } },
      { $project: { rating: 1 } },
      { $group: { _id: null, data: { $avg: '$rating' } } },
    ]);
    return data;
  },
};

// ------ Define an agenda for google sheet daily report ------
agenda.define('spreadsheet daily report', async () => {
  const { SPREADSHEET_ID } = process.env;
  try {
    // Init data
    const reportDate = new Date(2020, 2, 28);

    // Database queries
    const avgStarOfReview = await models.getAvgStarOfReview(reportDate);

    // Build Spreadsheet Schema
    const reportData = [
      [
        moment(reportDate).format('L'), // Column: Date
        avgStarOfReview[0] ? avgStarOfReview[0].data : 'error', // Column: Average Review Star
      ],
    ];

    // Write data to sheet
    appendDataToSheet(SPREADSHEET_ID, 'daily!A2', reportData);
  } catch (err) {
    console.error(err.message);
  }
});

export default async function () {
  await agenda.start();
  await agenda.every('*/2 * * * * *', 'spreadsheet daily report');
}
