import mongoose from 'mongoose';

const { Date, String, ObjectId, Number } = mongoose.SchemaTypes;

const schema = new mongoose.Schema({
  updatedAt: Date,
  createdAt: Date,
  user: ObjectId,
  text: String,
  mentor: ObjectId,
  booking: ObjectId,
  rating: Number,
});

export default mongoose.model('review', schema);
