'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRouter = void 0;
const express_1 = require("express");
const item_controller_1 = require("../controller/item.controller");
const controller = new item_controller_1.ItemController();
exports.itemRouter = (0, express_1.Router)();
exports.itemRouter.post('/create', controller.createItem);
exports.itemRouter.get('/:id', controller.getItem);
