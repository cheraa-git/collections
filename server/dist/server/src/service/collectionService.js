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
exports.getNextCollections = exports.getAllCollections = exports.editCollection = exports.deleteCollection = exports.getCollection = exports.createCollection = void 0;
const Collections_1 = require("../db/models/Collections");
const ItemConfigs_1 = require("../db/models/ItemConfigs");
const utils_1 = require("../utils");
const either_1 = require("@sweet-monads/either");
const DbError_1 = require("../../../common/errors/DbError");
const collectionQueries_1 = require("./queries/collectionQueries");
const searchService_1 = require("./searchService");
const createCollection = (collection, itemConfigs) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCollection = yield Collections_1.Collections.create(collection);
        if (itemConfigs && itemConfigs.length > 0) {
            const configs = itemConfigs.map(config => (Object.assign(Object.assign({}, config), { collectionId: newCollection.id })));
            yield ItemConfigs_1.ItemConfigs.bulkCreate(configs);
        }
        return (0, either_1.right)(newCollection.dataValues);
    }
    catch (e) {
        return (0, either_1.left)(new DbError_1.DbError('Create collection error', e));
    }
});
exports.createCollection = createCollection;
const getCollection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, collectionQueries_1.getFullCollectionDataQuery)(id);
        if (!response)
            return (0, either_1.right)(undefined);
        const collection = Object.assign(Object.assign({}, response.dataValues), { userName: response.users.nickname, itemConfigs: undefined, users: undefined, items: undefined });
        const items = response.items.map(i => (Object.assign({}, (0, utils_1.filterItem)(i))));
        return (0, either_1.right)({ collection, itemConfigs: response.itemConfigs, items });
    }
    catch (e) {
        return (0, either_1.left)(new DbError_1.DbError('Get collection error', e));
    }
});
exports.getCollection = getCollection;
const deleteCollection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, searchService_1.removeCollectionRelationshipIndexes)(id);
        return (0, either_1.right)(yield Collections_1.Collections.destroy({ where: { id }, force: true }));
    }
    catch (e) {
        return (0, either_1.left)(new DbError_1.DbError('Delete collection error'));
    }
});
exports.deleteCollection = deleteCollection;
const editCollection = ({ collection, removedConfigs, itemConfigs }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editedCollection = yield Collections_1.Collections.update(collection, { where: { id: collection.id }, returning: ['*'] });
        const editedConfigs = yield ItemConfigs_1.ItemConfigs.bulkCreate(itemConfigs, {
            updateOnDuplicate: ['type', 'label', 'hidden'], returning: ['*']
        });
        yield (0, collectionQueries_1.cascadeDeleteItemConfigs)(removedConfigs);
        return (0, either_1.right)({ collection: editedCollection[1][0], itemConfigs: editedConfigs });
    }
    catch (e) {
        return (0, either_1.left)(new DbError_1.DbError('Edit collection error', e));
    }
});
exports.editCollection = editCollection;
const getAllCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, either_1.right)(yield Collections_1.Collections.findAll());
    }
    catch (e) {
        return (0, either_1.left)(new DbError_1.DbError('Get all collection error'));
    }
});
exports.getAllCollections = getAllCollections;
const getNextCollections = (offset, limit, themeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = (yield (0, collectionQueries_1.getCollectionsByItemCountQuery)({ offset, limit, themeId }))
            .map((w) => (Object.assign(Object.assign({}, w.collections.dataValues), { userNickname: w.collections.users.nickname, countItems: w.dataValues.count, users: undefined })));
        if (collections.length === 0)
            return (0, either_1.right)([]);
        return (0, either_1.right)(collections);
    }
    catch (e) {
        return (0, either_1.left)(new DbError_1.DbError('getNextCollections: Error', e));
    }
});
exports.getNextCollections = getNextCollections;
