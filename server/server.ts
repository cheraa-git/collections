'use strict'

import { authRouter } from "./routes/auth.routes"

const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 8080

const app = express()
app.use(express.json())
app.use(cors());
app.use('/auth', authRouter)


app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}...`)
})
