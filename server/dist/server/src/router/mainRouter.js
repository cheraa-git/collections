"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const authRoutes_1 = require("./routes/authRoutes");
const collectionRoutes_1 = require("./routes/collectionRoutes");
const itemRoutes_1 = require("./routes/itemRoutes");
const profileRoutes_1 = require("./routes/profileRoutes");
const adminRoutes_1 = require("./routes/adminRoutes");
class MainRouter {
    constructor(app) {
        this.app = app;
    }
    useRoutes() {
        this.app.use('/auth', authRoutes_1.authRouter);
        this.app.use('/collection', collectionRoutes_1.collectionRouter);
        this.app.use('/item', itemRoutes_1.itemRoutes);
        this.app.use('/profile', profileRoutes_1.profileRouter);
        this.app.use('/admin', adminRoutes_1.adminRouter);
    }
}
exports.MainRouter = MainRouter;
