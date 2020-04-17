import mongoose from 'mongoose';

const {
  String, ObjectId, Date, Number,
} = mongoose.SchemaTypes;

const schema = new mongoose.Schema({
  updatedAt: Date,
  createdAt: Date,
  mentor: ObjectId,
  user: ObjectId,
  date: Date,
  conversation: ObjectId,
  status: String,
  completedAt: Date,
  canceledAt: Date,
  requiredCoins: Number,
  perHourPrice: Number,
  durationInMinute: Number,
});

export default mongoose.model('booking', schema);
