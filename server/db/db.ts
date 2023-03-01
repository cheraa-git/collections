'use strict'
import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
import { Users } from "./models/Users"
import { Collections } from "./models/Collections"
import { Items } from "./models/Items"
import { ItemConfigs } from "./models/ItemConfigs"
import { Tags } from "./models/Tags"
import { ItemsTags } from "./models/ItemsTags"
import { Themes } from "./models/Themes"
import { Comments } from "./models/Comments"
import { Likes } from "./models/Likes"

dotenv.config()

const connection = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  logging: false,
  models: [Users, Collections, Items, ItemConfigs, Tags, ItemsTags, Themes, Comments, Likes],
  dialectOptions: {
    ssl: true,
    native: true,
  },
  pool: {
    min: 0,
    max: 10,
    idle: 8000,
    acquire: 8000,
  }
})

export default connection



