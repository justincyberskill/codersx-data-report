import moment from 'moment';

import agenda from '../utils/agenda';
import { appendDataToSheet } from '../utils/googleapis';
import modelReviews from '../models/reviews';
import modelBookings from '../models/bookings';

const { SPREADSHEET_ID, AGENDA_DAILY_KPI_REPORT_CRON } = process.env;

// ------ Mongoose models interations with database ------
const models = {
  // Average review's star of day
  getAvgStarOfReview: async (date) => {
    const minTimestamp = moment(date).startOf('date').toDate();
    const maxTimestamp = moment(date).endOf('date').toDate();
    const data = await modelReviews.aggregate([
      { $match: { updatedAt: { $gte: minTimestamp, $lte: maxTimestamp } } },
      { $project: { rating: 1 } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    return data;
  },
  // Total new review in day
  getTotalReview: async (date) => {
    const minTimestamp = moment(date).startOf('date').toDate();
    const maxTimestamp = moment(date).endOf('date').toDate();
    const data = await modelReviews.aggregate([
      { $match: { updatedAt: { $gte: minTimestamp, $lte: maxTimestamp } } },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);
    return data;
  },
  // Total completed bookings in day
  getTotalCompletedBooking: async (date) => {
    const minTimestamp = moment(date).startOf('date').toDate();
    const maxTimestamp = moment(date).endOf('date').toDate();
    const data = await modelBookings.aggregate([
      {
        $match: {
          updatedAt: { $gte: minTimestamp, $lte: maxTimestamp },
          status: 'completed',
        },
      },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);
    return data;
  },
};

// ------ Define an agenda for google sheet daily report ------
agenda.define('daily mentor kpi report', async () => {
  try {
    // Init data
    const reportDate = moment().subtract(1, 'days').startOf('date').toDate();

    // Database queries
    const [
      avgStarOfReview,
      totalReview,
      totalCompletedBooking,
    ] = await Promise.all([
      models.getAvgStarOfReview(reportDate),
      models.getTotalReview(reportDate),
      models.getTotalCompletedBooking(reportDate),
    ]);

    // Build Spreadsheet Schema
    const reportPayload = [
      [
        moment(reportDate).format('L'), // Column: date
        avgStarOfReview[0] ? avgStarOfReview[0].avg : 'no data', // Column: average review star,
        totalReview[0] ? totalReview[0].total : 'no data', // Column: total review,
        totalCompletedBooking[0] ? totalCompletedBooking[0].total : 'no data', // Column: total completed bookings,
        totalReview[0] && totalCompletedBooking[0]
          ? Math.abs(totalCompletedBooking[0].total - totalReview[0].total)
          : 'no data', // Column: total missing review
      ],
    ];

    // Write data to sheet
    appendDataToSheet(SPREADSHEET_ID, 'daily-mentor-kpi!A2', reportPayload);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message);
  }
});

export default async function () {
  await agenda.every(AGENDA_DAILY_KPI_REPORT_CRON, 'daily mentor kpi report');
}
