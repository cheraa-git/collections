'use strict'
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Users } from "./models/Users"
dotenv.config();

const connection = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  logging: false,
  models: [Users],
  dialectOptions: {
    ssl: true,
    native: true,
  },
});

export default connection;



