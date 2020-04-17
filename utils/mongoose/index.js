/* eslint-disable no-console */
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const { MONGODB_URI: mongoUri } = process.env;
export default {
  connect(callback) {
    mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    const db = mongoose.connection;
    // eslint-disable-next-line no-console
    db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));
    db.once('open', () => {
      // eslint-disable-next-line no-console
      console.log('🍣 Great! MongoDB Connected!');
      if (callback) {
        callback();
      }
    });
  },
};
