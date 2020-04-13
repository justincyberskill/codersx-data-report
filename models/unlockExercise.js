import mongoose from 'mongoose';

const { ObjectId, Date } = mongoose.SchemaTypes;

const schema = new mongoose.Schema({
  updatedAt: Date,
  createdAt: Date,
  user: ObjectId,
  exercise: ObjectId,
});

export default mongoose.model('unlockexercise', schema);
