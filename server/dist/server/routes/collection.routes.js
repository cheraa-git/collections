'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionRouter = void 0;
const express_1 = require("express");
const collectionController_1 = require("../controller/collectionController");
const controller = new collectionController_1.CollectionController();
exports.collectionRouter = (0, express_1.Router)();
exports.collectionRouter.post('/', controller.createCollection);
exports.collectionRouter.patch('/', controller.editCollection);
exports.collectionRouter.delete('/', controller.deleteCollection);
exports.collectionRouter.get('/themes', controller.getThemes);
exports.collectionRouter.get('/:id', controller.getCollection);
