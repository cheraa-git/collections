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
  pool: {
    max: 5,
    min: 0,
    idle: 300000,
    acquire: 300000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    native: true,

  },
})

export default connection



