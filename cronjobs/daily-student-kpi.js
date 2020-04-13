import moment from 'moment';

import agenda from '../utils/agenda';
import { appendDataToSheet } from '../utils/googleapis';
import modelUnlockExercies from '../models/unlockExercise';
import modelCompletedLessons from '../models/completedlessons';

const { SPREADSHEET_ID, AGENDA_DAILY_KPI_REPORT_CRON } = process.env;

// ------ Mongoose models interations with database ------
const models = {
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
agenda.define('daily student kpi report', async () => {
  try {
    // Init data
    const reportDate = moment().subtract(1, 'days').startOf('date').toDate();

    // Database queries
    const [totalUnlockExercise, totalCompletedLessions] = await Promise.all([
      models.getTotalUnlockedExercise(reportDate),
      models.getTotalCompletedLesson(reportDate),
    ]);

    // Build Spreadsheet Schema
    const reportPayload = [
      [
        moment(reportDate).format('L'), // Column: date
        totalUnlockExercise[0] ? totalUnlockExercise[0].total : 'error', // Column: total unlocked exercise,
        totalCompletedLessions[0] ? totalCompletedLessions[0].total : 'error', // Column: total completed lessons,
      ],
    ];

    // Write data to sheet
    appendDataToSheet(SPREADSHEET_ID, 'daily-student-kpi!A2', reportPayload);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message);
  }
});

export default async function () {
  await agenda.every(AGENDA_DAILY_KPI_REPORT_CRON, 'daily student kpi report');
}
