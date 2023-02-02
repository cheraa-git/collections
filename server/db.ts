'use strict'
import { Pool } from 'pg'
import { config } from "dotenv"

config()

export const db = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  ssl: true
})



