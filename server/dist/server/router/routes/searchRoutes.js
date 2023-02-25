'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const express_1 = require("express");
const searchController_1 = require("../controller/searchController");
const controller = new searchController_1.SearchController();
exports.profileRouter = (0, express_1.Router)();
exports.profileRouter.get('/:userId', controller.indexingItemsHandler);
