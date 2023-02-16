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
const item_router_1 = require("./routes/item.router");
const http_1 = __importDefault(require("http"));
const mainSocket_1 = require("./socket/mainSocket");
const express = require('express');
const cors = require('cors');
(0, dotenv_1.config)();
const PORT = process.env.PORT || 8080;
const app = express();
const server = http_1.default.createServer(app);
const Socket = new mainSocket_1.MainSocket(server);
Socket.onEvents();
app.use(express.json());
app.use(cors());
app.use('/auth', auth_routes_1.authRouter);
app.use('/collection', collection_routes_1.collectionRouter);
app.use('/item', item_router_1.itemRouter);
app.use('/profile', profile_routes_1.profileRouter);
db_1.default.sync().then(() => {
    console.log('Database synced success');
})
    .catch((err) => {
    console.log('DATABASE_ERROR', err);
});
server.listen(PORT, () => {
    console.log(`App listen on port ${PORT}...`);
});
