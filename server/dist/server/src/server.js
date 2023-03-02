'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const mainSocket_1 = require("./socket/mainSocket");
const express_1 = __importDefault(require("express"));
const mainRouter_1 = require("./router/mainRouter");
const cors = require('cors');
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const Socket = new mainSocket_1.MainSocket(server);
const Router = new mainRouter_1.MainRouter(app);
app.use(express_1.default.json());
app.use(cors());
Socket.onEvents();
Router.useRoutes();
db_1.default.sync()
    .then(() => console.log('Database synced success'))
    .catch((err) => console.log('DATABASE_ERROR', err));
server.listen(PORT, () => {
    console.log(`App listen on port ${PORT}...`);
});
