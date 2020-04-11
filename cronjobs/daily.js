import moment from 'moment';

import agenda from '../utils/agenda';
import { appendDataToSheet } from '../utils/googleapis';
import modelReviews from '../models/reviews';
import modelUnlockExercies from '../models/unlockExercise';
import modelBookings from '../models/bookings';
import modelCompletedLessons from '../models/completedlessons';

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
  // Total unlocked exercise in day
  getTotalUnlockedExercise: async (date) => {
    const minTimestamp = moment(date).startOf('date').toDate();
    const maxTimestamp = moment(date).endOf('date').toDate();
    const data = await modelUnlockExercies.aggregate([
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
  // Tota completed lessons in day
  getTotalCompletedLesson: async (date) => {
    const minTimestamp = moment(date).startOf('date').toDate();
    const maxTimestamp = moment(date).endOf('date').toDate();
    const data = await modelCompletedLessons.aggregate([
      {
        $match: {
          updatedAt: { $gte: minTimestamp, $lte: maxTimestamp },
        },
      },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);
    return data;
  },
};

// ------ Define an agenda for google sheet daily report ------
agenda.define('spreadsheet daily report', async () => {
  const { SPREADSHEET_ID } = process.env;
  try {
    // Init data
    const reportDate = new Date(2020, 2, 28, 3, 0, 0);

    // Database queries
    const [
      avgStarOfReview,
      totalReview,
      totalUnlockExercise,
      totalCompletedBooking,
      totalCompletedLessions,
    ] = await Promise.all([
      models.getAvgStarOfReview(reportDate),
      models.getTotalReview(reportDate),
      models.getTotalUnlockedExercise(reportDate),
      models.getTotalCompletedBooking(reportDate),
      models.getTotalCompletedLesson(reportDate),
    ]);
    console.log(totalCompletedLessions);

    // Build Spreadsheet Schema
    const reportPayload = [
      [
        moment(reportDate).format('L'), // Column: date
        avgStarOfReview[0] ? avgStarOfReview[0].avg : 'error', // Column: average review star,
        totalReview[0] ? totalReview[0].total : 'error', // Column: total review,
        totalUnlockExercise[0] ? totalUnlockExercise[0].total : 'error', // Column: total unlocked exercise,
        totalCompletedBooking[0] ? totalCompletedBooking[0].total : 'error', // Column: total completed bookings,
        totalCompletedLessions[0] ? totalCompletedLessions[0].total : 'error', // Column: total completed lessons,
      ],
    ];

    // Write data to sheet
    appendDataToSheet(SPREADSHEET_ID, 'daily!A2', reportPayload);
  } catch (err) {
    console.error(err.message);
  }
});

export default async function () {
  await agenda.start();
  await agenda.every('*/2 * * * * *', 'spreadsheet daily report');
}
