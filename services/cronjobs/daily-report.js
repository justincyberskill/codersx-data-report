import moment from 'moment';
import model from '../../models/reviews';
import { CronJob } from 'cron';
import { writeToSheet } from '../../utils/googleapis';

const { SPREADSHEET_ID } = process.env;

const getAvgStarOfReview = async (date) => {
  // Average review's star of the day
  const minTimestamp = moment(date).subtract(1, 'days').toDate();
  const maxTimestamp = moment(date).add(1, 'days').toDate();
  return await model.aggregate([
    { $match: { updatedAt: { $gte: minTimestamp, $lt: maxTimestamp } } },
    { $project: { rating: 1 } },
    { $group: { _id: null, data: { $avg: '$rating' } } }
  ]);
};

// ------ Your code start here ------
export const dailyCronjob = async function (date) {
  try {
    const avgStarOfReview = await getAvgStarOfReview(date);

    const reportData = [
      [
        moment().format('L'), // Column: Date
        avgStarOfReview[0]?.data || 'error' // Column: Average Review Star
      ]
    ];

    // Cronjon will run
    new CronJob(
      '15 3 * * *',
      function () {
        writeToSheet(SPREADSHEET_ID, 'daily!A2', reportData);
      },
      null,
      true,
      'Asia/Ho_Chi_Minh'
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.message);
  }
};
