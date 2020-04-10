const mongoose = require("mongoose")
const { Date, String, ObjectId, Number } = mongoose.SchemaTypes

const schema = new mongoose.Schema({
  updatedAt: Date,
  createdAt: Date,
  user: ObjectId,
  text: String,
  mentor: ObjectId,
  booking: ObjectId,
  rating: Number
})

const model = mongoose.model("review", schema)
module.exports = model
