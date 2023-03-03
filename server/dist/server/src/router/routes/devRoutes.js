'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.devRouter = void 0;
const express_1 = require("express");
const devController_1 = require("../controller/devController");
const meilisearch_1 = require("../../apis/meilisearch");
const controller = new devController_1.DevController();
exports.devRouter = (0, express_1.Router)();
const test = (req, res) => {
    const index = new meilisearch_1.SearchClient().index('comments');
    index.search('ni', { attributesToCrop: ['itemId'], })
        .then(r => res.json(r));
};
exports.devRouter.post('/meilisearch_setup', controller.meiliSearchSetup);
exports.devRouter.post('/indexing/collections', controller.indexingCollections);
exports.devRouter.post('/indexing/items', controller.indexingItems);
exports.devRouter.post('/indexing/comments', controller.indexingComments);
exports.devRouter.post('/test', test);
