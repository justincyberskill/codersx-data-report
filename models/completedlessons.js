import mongoose from 'mongoose';

const { Date, ObjectId } = mongoose.SchemaTypes;

const schema = new mongoose.Schema({
  updatedAt: Date,
  createdAt: Date,
  lesson: ObjectId,
  user: ObjectId,
});

export default mongoose.model('completedlesson', schema);
