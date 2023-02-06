'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db/db"));
const auth_routes_1 = require("./routes/auth.routes");
const dotenv_1 = require("dotenv");
const collection_routes_1 = require("./routes/collection.routes");
const profile_routes_1 = require("./routes/profile.routes");
const express = require('express');
const cors = require('cors');
(0, dotenv_1.config)();
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors());
app.use('/auth', auth_routes_1.authRouter);
app.use('/collection', collection_routes_1.collectionRouter);
app.use('/profile', profile_routes_1.profileRouter);
db_1.default
    .sync()
    .then(() => {
    console.log('Database synced success');
})
    .catch((err) => {
    console.log('Err', err);
});
app.listen(PORT, () => {
    console.log(`App listen on port ${PORT}...`);
});