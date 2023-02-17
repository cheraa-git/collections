'use strict'
import connection from "./db/db"
import { config } from "dotenv"
import http from "http"
import { MainSocket } from "./socket/mainSocket"
import express from 'express'
import { MainRouter } from "./router/mainRouter"


const cors = require('cors')
config()

const PORT = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)
const Socket = new MainSocket(server)
const Router = new MainRouter(app)

app.use(express.json())
app.use(cors())

Socket.onEvents()
Router.useRoutes()

connection.sync()
  .then(() => console.log('Database synced success'))
  .catch((err) => console.log('DATABASE_ERROR', err))

server.listen(PORT, () => {
  console.log(`App listen on port ${PORT}...`)
})
