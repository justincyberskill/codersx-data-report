import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const { MONGO_URI_LOCAL: mongoUri } = process.env;
export default {
  connect(callback) {
    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));
    db.once('open', () => {
      console.log('🍣 Great! MongoDB Connected!');
      if (callback) {
        callback();
      }
    });
  },
};
