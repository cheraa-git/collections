"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexingAllCollections = exports.removeCollectionIndex = exports.uploadCollectionIndex = exports.addCollectionIndex = exports.indexingAllComments = exports.removeCommentIndex = exports.addCommentIndex = exports.indexingAllItems = exports.removeItemIndex = exports.uploadItemIndex = exports.addItemIndex = void 0;
const meilisearch_1 = require("../apis/meilisearch");
const utils_1 = require("../utils");
const itemService_1 = require("./itemService");
const CommentService_1 = require("./CommentService");
const collectionService_1 = require("./collectionService");
const addItemIndex = (item) => {
    const index = new meilisearch_1.SearchClient().index('items');
    index.addDocuments([(0, utils_1.filterItem)(item)])
        // .then(e => console.log('CREATE_INDEX_SUCCESS', e))
        .catch(e => console.log('CREATE_INDEX_ERROR', e));
};
exports.addItemIndex = addItemIndex;
const uploadItemIndex = (item) => {
    const index = new meilisearch_1.SearchClient().index('items');
    index.updateDocuments([item])
        // .then(e => console.log('UPLOAD_INDEX_SUCCESS', e))
        .catch(e => console.log('UPLOAD_INDEX_ERROR', e));
};
exports.uploadItemIndex = uploadItemIndex;
const removeItemIndex = (itemId) => {
    const index = new meilisearch_1.SearchClient().index('items');
    index.deleteDocument(itemId)
        // .then(e => console.log('DELETE_INDEX_SUCCESS', e))
        .catch(e => console.log('DELETE_INDEX_ERROR', e));
};
exports.removeItemIndex = removeItemIndex;
const indexingAllItems = () => __awaiter(void 0, void 0, void 0, function* () {
    const index = new meilisearch_1.SearchClient().index('items');
    yield index.deleteAllDocuments();
    const items = (yield (0, itemService_1.getAllItems)()).map(item => (0, utils_1.filterItem)(item));
    yield index.addDocuments(items);
});
exports.indexingAllItems = indexingAllItems;
const addCommentIndex = (comment) => {
    const index = new meilisearch_1.SearchClient().index('comments');
    index.addDocuments([comment.dataValues])
        // .then(e => console.log('CREATE_INDEX_SUCCESS', e))
        .catch(e => console.log('CREATE_INDEX_ERROR', e));
};
exports.addCommentIndex = addCommentIndex;
const removeCommentIndex = (commentId) => {
    const index = new meilisearch_1.SearchClient().index('items');
    index.deleteDocument(commentId)
        // .then(e => console.log('DELETE_INDEX_SUCCESS', e))
        .catch(e => console.log('DELETE_INDEX_ERROR', e));
};
exports.removeCommentIndex = removeCommentIndex;
const indexingAllComments = () => __awaiter(void 0, void 0, void 0, function* () {
    const index = new meilisearch_1.SearchClient().index('comments');
    yield index.deleteAllDocuments();
    yield index.addDocuments(yield (0, CommentService_1.getAllComments)());
});
exports.indexingAllComments = indexingAllComments;
const addCollectionIndex = (collection) => {
    const index = new meilisearch_1.SearchClient().index('collections');
    index.addDocuments([collection.dataValues])
        // .then(e => console.log('CREATE_INDEX_SUCCESS', e))
        .catch(e => console.log('CREATE_INDEX_ERROR', e));
};
exports.addCollectionIndex = addCollectionIndex;
const uploadCollectionIndex = (collection) => {
    const index = new meilisearch_1.SearchClient().index('collections');
    index.updateDocuments([collection])
        // .then(e => console.log('UPLOAD_INDEX_SUCCESS', e))
        .catch(e => console.log('UPLOAD_INDEX_ERROR', e));
};
exports.uploadCollectionIndex = uploadCollectionIndex;
const removeCollectionIndex = (collectionId) => {
    const index = new meilisearch_1.SearchClient().index('collections');
    index.deleteDocument(collectionId)
        // .then(e => console.log('DELETE_INDEX_SUCCESS', e))
        .catch(e => console.log('DELETE_INDEX_ERROR', e));
};
exports.removeCollectionIndex = removeCollectionIndex;
const indexingAllCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    const index = new meilisearch_1.SearchClient().index('collections');
    yield index.deleteAllDocuments();
    yield index.addDocuments(yield (0, collectionService_1.getAllCollections)());
});
exports.indexingAllCollections = indexingAllCollections;
