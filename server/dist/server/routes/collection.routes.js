'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionRouter = void 0;
const express_1 = require("express");
const collection_controller_1 = require("../controller/collection.controller");
const controller = new collection_controller_1.CollectionController();
exports.collectionRouter = (0, express_1.Router)();
exports.collectionRouter.post('/create', controller.createCollection);
exports.collectionRouter.get('/:id', controller.getCollection);
