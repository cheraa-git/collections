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
exports.indexingAllCollections = exports.indexingAllComments = exports.indexingAllItems = exports.removeCollectionRelationshipIndexes = exports.removeCollectionIndex = exports.uploadCollectionIndex = exports.addCollectionIndex = exports.removeItemCommentsIndexes = exports.removeCommentIndex = exports.addCommentIndex = exports.removeItemIndex = exports.uploadItemIndex = exports.addItemIndex = void 0;
const meilisearch_1 = require("../apis/meilisearch");
const Items_1 = require("../db/models/Items");
const utils_1 = require("../utils");
const itemService_1 = require("./itemService");
const Comments_1 = require("../db/models/Comments");
const commentService_1 = require("./commentService");
const collectionService_1 = require("./collectionService");
const either_1 = require("@sweet-monads/either");
const IndexError_1 = require("../../../common/errors/IndexError");
const addItemIndex = (item) => {
    const index = new meilisearch_1.SearchClient().index('items');
    index.addDocuments([(0, utils_1.filterItem)(item)])
        .catch(e => console.log('CREATE_INDEX_ERROR', e));
};
exports.addItemIndex = addItemIndex;
const uploadItemIndex = (item) => {
    const index = new meilisearch_1.SearchClient().index('items');
    index.updateDocuments([item])
        .catch(e => console.log('UPLOAD_INDEX_ERROR', e));
};
exports.uploadItemIndex = uploadItemIndex;
const removeItemIndex = (itemId) => {
    const index = new meilisearch_1.SearchClient().index('items');
    index.deleteDocument(itemId)
        .catch(e => console.log('DELETE_INDEX_ERROR', e));
};
exports.removeItemIndex = removeItemIndex;
const addCommentIndex = (comment) => {
    const index = new meilisearch_1.SearchClient().index('comments');
    index.addDocuments([comment.dataValues])
        .catch(e => console.log('CREATE_INDEX_ERROR', e));
};
exports.addCommentIndex = addCommentIndex;
const removeCommentIndex = (commentId) => {
    const index = new meilisearch_1.SearchClient().index('comments');
    index.deleteDocument(commentId)
        .catch(e => console.log('DELETE_INDEX_ERROR', e));
};
exports.removeCommentIndex = removeCommentIndex;
const removeItemCommentsIndexes = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const index = new meilisearch_1.SearchClient().index('comments');
    const itemCommentIds = (yield Comments_1.Comments.findAll({ where: { itemId } })).map(comment => comment.id);
    index.deleteDocuments(itemCommentIds)
        .catch(e => console.log('DELETE_INDEXES_ERROR', e));
});
exports.removeItemCommentsIndexes = removeItemCommentsIndexes;
const addCollectionIndex = (collection) => {
    const index = new meilisearch_1.SearchClient().index('collections');
    index.addDocuments([collection.dataValues])
        .catch(e => console.log('CREATE_INDEX_ERROR', e));
};
exports.addCollectionIndex = addCollectionIndex;
const uploadCollectionIndex = (collection) => {
    const index = new meilisearch_1.SearchClient().index('collections');
    index.updateDocuments([collection])
        .catch(e => console.log('UPLOAD_INDEX_ERROR', e));
};
exports.uploadCollectionIndex = uploadCollectionIndex;
const removeCollectionIndex = (collectionId) => {
    const index = new meilisearch_1.SearchClient().index('collections');
    index.deleteDocument(collectionId)
        .catch(e => console.log('DELETE_INDEX_ERROR', e));
};
exports.removeCollectionIndex = removeCollectionIndex;
const removeCollectionRelationshipIndexes = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new meilisearch_1.SearchClient();
    const itemIndex = client.index('items');
    const commentIndex = client.index('comments');
    const itemIds = (yield Items_1.Items.findAll({ where: { collectionId } })).map(item => item.id);
    const commentIds = (yield Comments_1.Comments.findAll({ where: { itemId: itemIds } })).map(comment => comment.id);
    itemIndex.deleteDocuments(itemIds)
        .catch(e => console.log('DELETE_INDEXES_ERROR', e));
    commentIndex.deleteDocuments(commentIds)
        .catch(e => console.log('DELETE_INDEXES_ERROR', e));
});
exports.removeCollectionRelationshipIndexes = removeCollectionRelationshipIndexes;
const indexingAllItems = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const index = new meilisearch_1.SearchClient().index('items');
        yield index.deleteAllDocuments();
        return (yield (0, itemService_1.getAllItems)())
            .mapLeft(e => new IndexError_1.IndexError('Get items error', e))
            .asyncMap((items) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield index.addDocuments(items.map(item => (0, utils_1.filterItem)(item)));
            return { status: response.status };
        }));
    }
    catch (e) {
        return (0, either_1.left)(new IndexError_1.IndexError('Indexing all items error', e));
    }
});
exports.indexingAllItems = indexingAllItems;
const indexingAllComments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const index = new meilisearch_1.SearchClient().index('comments');
        yield index.deleteAllDocuments();
        return (yield (0, commentService_1.getAllComments)())
            .mapLeft(e => new IndexError_1.IndexError('Get comments error', e))
            .asyncMap((comments) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield index.addDocuments(comments);
            return { status: response.status };
        }));
    }
    catch (e) {
        return (0, either_1.left)(new IndexError_1.IndexError('Indexing all comments error', e));
    }
});
exports.indexingAllComments = indexingAllComments;
const indexingAllCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const index = new meilisearch_1.SearchClient().index('collections');
        yield index.deleteAllDocuments();
        return (yield (0, collectionService_1.getAllCollections)())
            .mapLeft(e => new IndexError_1.IndexError('Get collections error', e))
            .asyncMap((collections) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield index.addDocuments(collections);
            return { status: response.status };
        }));
    }
    catch (e) {
        return (0, either_1.left)(new IndexError_1.IndexError('Indexing all collections error', e));
    }
});
exports.indexingAllCollections = indexingAllCollections;
