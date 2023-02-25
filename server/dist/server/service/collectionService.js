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
exports.getAllCollections = exports.editCollection = exports.deleteCollection = exports.getCollection = exports.createCollection = void 0;
const Collections_1 = require("../db/models/Collections");
const ItemConfigs_1 = require("../db/models/ItemConfigs");
const Users_1 = require("../db/models/Users");
const Items_1 = require("../db/models/Items");
const Tags_1 = require("../db/models/Tags");
const utils_1 = require("../utils");
const createCollection = (collection, itemConfigs) => __awaiter(void 0, void 0, void 0, function* () {
    const newCollection = yield Collections_1.Collections.create(collection);
    if (itemConfigs && itemConfigs.length > 0) {
        const configs = itemConfigs.map(config => (Object.assign(Object.assign({}, config), { collectionId: newCollection.id })));
        yield ItemConfigs_1.ItemConfigs.bulkCreate(configs);
    }
    return newCollection.dataValues;
});
exports.createCollection = createCollection;
const getCollection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield Collections_1.Collections.findOne({
        where: { id },
        include: [
            { model: ItemConfigs_1.ItemConfigs },
            { model: Users_1.Users, attributes: ['nickname'] },
            { model: Items_1.Items, include: [{ model: Tags_1.Tags, through: { attributes: [] } }] }
        ]
    });
    const collection = Object.assign(Object.assign({}, response === null || response === void 0 ? void 0 : response.dataValues), { userName: response === null || response === void 0 ? void 0 : response.users.nickname, itemConfigs: undefined, users: undefined, items: undefined });
    const items = response === null || response === void 0 ? void 0 : response.items.map(i => (Object.assign(Object.assign({}, (0, utils_1.filterItem)(i)), { userId: response === null || response === void 0 ? void 0 : response.userId })));
    return { collection, itemConfigs: response === null || response === void 0 ? void 0 : response.itemConfigs, items };
});
exports.getCollection = getCollection;
const deleteCollection = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Collections_1.Collections.destroy({ where: { id }, force: true });
});
exports.deleteCollection = deleteCollection;
const editCollection = (collection, itemConfigs) => __awaiter(void 0, void 0, void 0, function* () {
    const editedCollection = yield Collections_1.Collections.update(collection, { where: { id: collection.id }, returning: ['*'] });
    const editedConfigs = yield ItemConfigs_1.ItemConfigs.bulkCreate(itemConfigs, {
        updateOnDuplicate: ['type', 'label'],
        returning: ['*']
    });
    return { collection: editedCollection[1][0], itemConfigs: editedConfigs };
});
exports.editCollection = editCollection;
const getAllCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Collections_1.Collections.findAll();
});
exports.getAllCollections = getAllCollections;
