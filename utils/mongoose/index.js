const mongoose = require("mongoose")
const { MONGO_URI_LOCAL } = process.env

module.exports = function () {
  mongoose.connect(MONGO_URI_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const db = mongoose.connection
  db.on("error", console.error.bind(console, "MongoDB Connection Error:"))
  db.once("open", () => console.log("🍣 Great! MongoDB Connected!"))
}
