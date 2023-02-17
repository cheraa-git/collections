"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const authRoutes_1 = require("./routes/authRoutes");
const collectionRoutes_1 = require("./routes/collectionRoutes");
const itemRouter_1 = require("./routes/itemRouter");
const profileRoutes_1 = require("./routes/profileRoutes");
class MainRouter {
    constructor(app) {
        this.app = app;
    }
    useRoutes() {
        this.app.use('/auth', authRoutes_1.authRouter);
        this.app.use('/collection', collectionRoutes_1.collectionRouter);
        this.app.use('/item', itemRouter_1.itemRouter);
        this.app.use('/profile', profileRoutes_1.profileRouter);
    }
}
exports.MainRouter = MainRouter;
