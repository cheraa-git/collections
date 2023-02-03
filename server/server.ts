'use strict'
import connection from "./db/db"
import { authRouter } from "./routes/auth.routes"
import { config } from "dotenv"

const express = require('express')
const cors = require('cors')
config()

const PORT = process.env.PORT || 8080

const app = express()
app.use(express.json())
app.use(cors())
app.use('/auth', authRouter)
connection
  .sync()
  .then(() => {
    console.log('Database synced success')
  })
  .catch((err) => {
    console.log('Err', err)
  })

app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}...`)
})
