require("dotenv").config()
const app = require("express")()

require("./utils/mongoose")()
require("./utils/googleapis")()

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`🚀 Server is running at port ${port}`))
