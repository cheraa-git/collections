'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const Users_1 = require("./models/Users");
const Collections_1 = require("./models/Collections");
const Items_1 = require("./models/Items");
const ItemConfigs_1 = require("./models/ItemConfigs");
const Tags_1 = require("./models/Tags");
const ItemsTags_1 = require("./models/ItemsTags");
dotenv_1.default.config();
const connection = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: process.env.PGHOST,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    logging: false,
    models: [Users_1.Users, Collections_1.Collections, Items_1.Items, ItemConfigs_1.ItemConfigs, Tags_1.Tags, ItemsTags_1.ItemsTags],
    dialectOptions: {
        ssl: true,
        native: true,
    },
});
exports.default = connection;
