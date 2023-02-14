'use strict'
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Users } from "./models/Users"
import { Collections } from "./models/Collections"
import { Items } from "./models/Items"
import { ItemConfigs } from "./models/ItemConfigs"
import { Tags } from "./models/Tags"
import { ItemsTags } from "./models/ItemsTags"
import { Themes } from "./models/Themes"
dotenv.config();

const connection = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  logging: false,
  models: [Users, Collections, Items, ItemConfigs, Tags, ItemsTags, Themes],
  dialectOptions: {
    ssl: true,
    native: true,
  },
});

export default connection;



