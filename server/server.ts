'use strict'
import connection from "./db/db"
import { authRouter } from "./routes/auth.routes"
import { config } from "dotenv"
import { collectionRouter } from "./routes/collection.routes"
import { profileRouter } from "./routes/profile.routes"
import { itemRouter } from "./routes/item.router"
import http from "http"
import { MainSocket } from "./socket/mainSocket"


const express = require('express')
const cors = require('cors')
config()

const PORT = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)
const Socket = new MainSocket(server)
Socket.onEvents()

app.use(express.json())
app.use(cors())
app.use('/auth', authRouter)
app.use('/collection', collectionRouter)
app.use('/item', itemRouter)
app.use('/profile', profileRouter)
connection.sync().then(() => {
  console.log('Database synced success')
})
  .catch((err) => {
    console.log('DATABASE_ERROR', err)
  })

server.listen(PORT, () => {
  console.log(`App listen on port ${PORT}...`)
})
