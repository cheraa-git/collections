'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRouter = void 0;
const express_1 = require("express");
const itemController_1 = require("../controller/itemController");
const controller = new itemController_1.ItemController();
exports.itemRouter = (0, express_1.Router)();
exports.itemRouter.post('/', controller.createItem);
exports.itemRouter.patch('/', controller.editItem);
exports.itemRouter.delete('/', controller.deleteItem);
exports.itemRouter.get('/:collectionId/:id', controller.getItem);