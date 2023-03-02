'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controller/adminController"));
const controller = new adminController_1.default();
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.get('/users', controller.handleGetUsers);
exports.adminRouter.post('/users/status', controller.handleSetUsersStatus);
exports.adminRouter.post('/users/admin_status', controller.handleSetAdminStatus);
exports.adminRouter.post('/indexing/items', controller.indexingItemsHandler);
exports.adminRouter.post('/indexing/comments', controller.indexingCommentsHandler);
exports.adminRouter.post('/indexing/collections', controller.indexingCollectionsHandler);
