require("dotenv").config()
const app = require("express")()

require("./utils/mongoose")() // Setup MongoDB Database

const cronjobs = require("./cronjobs")
cronjobs.dailyReport()

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`🚀 Server is running at port ${port}`))
