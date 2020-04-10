import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const { MONGO_URI_LOCAL } = process.env;
export default {
  connect(callback) {
    mongoose.connect(MONGO_URI_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));
    db.once('open', () => {
      console.log('🍣 Great! MongoDB Connected!');
      callback && callback();
    });
  }
};
