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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllItems = exports.deleteItem = exports.editItem = exports.getItemAuthorId = exports.getItem = exports.createItem = void 0;
const Items_1 = require("../db/models/Items");
const utils_1 = require("../utils");
const Tags_1 = require("../db/models/Tags");
const ItemsTags_1 = require("../db/models/ItemsTags");
const ItemConfigs_1 = require("../db/models/ItemConfigs");
const Collections_1 = require("../db/models/Collections");
const createItemTags = (tags, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const addedTags = tags.filter(tag => tag.id);
    const createdTags = (yield Tags_1.Tags.bulkCreate(tags.filter(tag => !tag.id))).map(tag => tag.dataValues);
    const itemTags = [...addedTags, ...createdTags].map(tag => ({ itemId, tagId: tag.id }));
    yield ItemsTags_1.ItemsTags.bulkCreate(itemTags);
    return [...addedTags, ...createdTags];
});
const editItemTags = (tags, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    yield ItemsTags_1.ItemsTags.destroy({ where: { itemId } });
    yield createItemTags(tags, itemId);
    return tags;
});
const createItem = (userId, collectionId, fields, tags) => __awaiter(void 0, void 0, void 0, function* () {
    const timestamp = `${Date.now()}`;
    const newItem = yield Items_1.Items.create(Object.assign({ collectionId, timestamp }, fields));
    return Object.assign(Object.assign({}, (0, utils_1.filterItem)(newItem)), { tags: yield createItemTags(tags, newItem.id), userId });
});
exports.createItem = createItem;
const getItem = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const item = yield Items_1.Items.findOne({ where: { id: itemId }, include: [{ model: Tags_1.Tags, through: { attributes: [] } }] });
    const itemConfigs = yield ItemConfigs_1.ItemConfigs.findAll({ where: { collectionId: item === null || item === void 0 ? void 0 : item.collectionId } });
    const userId = (_a = (yield Collections_1.Collections.findOne({ where: { id: item === null || item === void 0 ? void 0 : item.collectionId }, attributes: ['userId'] }))) === null || _a === void 0 ? void 0 : _a.userId;
    return { item: Object.assign(Object.assign({}, (0, utils_1.filterItem)(item)), { userId }), itemConfigs };
});
exports.getItem = getItem;
const getItemAuthorId = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield Collections_1.Collections.findOne({ where: { id: collectionId }, attributes: ['userId'] });
    return response === null || response === void 0 ? void 0 : response.userId;
});
exports.getItemAuthorId = getItemAuthorId;
const editItem = (item) => __awaiter(void 0, void 0, void 0, function* () {
    const { tags } = item, editingItem = __rest(item, ["tags"]);
    const updatedItem = yield Items_1.Items.update(editingItem, { where: { id: editingItem.id }, returning: ['*'] });
    const updatedTags = yield editItemTags(tags, editingItem.id);
    return Object.assign(Object.assign({}, (0, utils_1.filterItem)(updatedItem[1][0])), { tags: updatedTags });
});
exports.editItem = editItem;
const deleteItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Items_1.Items.destroy({ where: { id }, force: true });
});
exports.deleteItem = deleteItem;
const getAllItems = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Items_1.Items.findAll();
});
exports.getAllItems = getAllItems;
