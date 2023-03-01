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
exports.getNextItems = exports.getAllItems = exports.deleteItem = exports.editItem = exports.getItemAuthorId = exports.getItem = exports.createItem = void 0;
const Items_1 = require("../db/models/Items");
const utils_1 = require("../utils");
const Tags_1 = require("../db/models/Tags");
const ItemsTags_1 = require("../db/models/ItemsTags");
const ItemConfigs_1 = require("../db/models/ItemConfigs");
const Collections_1 = require("../db/models/Collections");
const either_1 = require("@sweet-monads/either");
const DatabaseError_1 = require("../../common/errors/DatabaseError");
const NotFoundError_1 = require("../../common/errors/NotFoundError");
const Users_1 = require("../db/models/Users");
const itemQueries_1 = require("./queries/itemQueries");
const createItemTags = (tags, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addedTags = tags.filter(tag => tag.id);
        const createdTags = (yield Tags_1.Tags.bulkCreate(tags.filter(tag => !tag.id))).map(tag => tag.dataValues);
        const itemTags = [...addedTags, ...createdTags].map(tag => ({ itemId, tagId: tag.id }));
        yield ItemsTags_1.ItemsTags.bulkCreate(itemTags);
        return (0, either_1.right)([...addedTags, ...createdTags]);
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('Create item tags error', e));
    }
});
const editItemTags = (tags, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ItemsTags_1.ItemsTags.destroy({ where: { itemId } });
        const response = yield createItemTags(tags, itemId);
        return response.map(() => tags);
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('Edit item tags error', e));
    }
});
const createItem = (userId, collectionId, fields, tags) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timestamp = `${Date.now()}`;
        const newItem = yield Items_1.Items.create(Object.assign({ collectionId, timestamp }, fields));
        const newTagsResponse = yield createItemTags(tags, newItem.id);
        return newTagsResponse.map(newTags => (Object.assign(Object.assign({}, (0, utils_1.filterItem)(newItem)), { tags: newTags })));
    }
    catch (e) {
        console.log(e);
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('Create item error', e));
    }
});
exports.createItem = createItem;
const getItem = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const item = yield (0, itemQueries_1.getItemWithTagsQuery)({ itemId });
        if (!item)
            return (0, either_1.left)(new NotFoundError_1.NotFoundError(`Item number ${itemId} not found`));
        const itemConfigs = yield ItemConfigs_1.ItemConfigs.findAll({ where: { collectionId: item === null || item === void 0 ? void 0 : item.collectionId } });
        const user = (_a = (yield Collections_1.Collections.findOne({ where: { id: item.collectionId }, include: Users_1.Users }))) === null || _a === void 0 ? void 0 : _a.users;
        return (0, either_1.right)({ item: Object.assign(Object.assign({}, (0, utils_1.filterItem)(item)), { userId: user === null || user === void 0 ? void 0 : user.id, userNickname: user === null || user === void 0 ? void 0 : user.nickname }), itemConfigs });
    }
    catch (e) {
        console.log('item', e);
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('Get item error', e));
    }
});
exports.getItem = getItem;
const getItemAuthorId = (collectionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield Collections_1.Collections.findOne({ where: { id: collectionId }, attributes: ['userId'] });
        return response === null || response === void 0 ? void 0 : response.userId;
    }
    catch (e) {
        return undefined;
    }
});
exports.getItemAuthorId = getItemAuthorId;
const editItem = (item) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tags } = item, editingItem = __rest(item, ["tags"]);
        const updatedItem = yield Items_1.Items.update(editingItem, { where: { id: editingItem.id }, returning: ['*'] });
        const updatedTagsResponse = (yield editItemTags(tags, editingItem.id));
        return updatedTagsResponse
            .map(updatedTags => (Object.assign(Object.assign({}, (0, utils_1.filterItem)(updatedItem[1][0])), { tags: updatedTags })));
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('Edit item error', e));
    }
});
exports.editItem = editItem;
const deleteItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, either_1.right)(yield Items_1.Items.destroy({ where: { id }, force: true }));
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('Delete item error', e));
    }
});
exports.deleteItem = deleteItem;
const getAllItems = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, either_1.right)(yield Items_1.Items.findAll());
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('Delete item error', e));
    }
});
exports.getAllItems = getAllItems;
const getNextItems = (offset, limit, tagIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield (0, itemQueries_1.getRangeItemsQuery)({ offset, limit, tagIds });
        if (items.length === 0)
            return (0, either_1.right)([]);
        return (0, either_1.right)(items.map(item => (0, utils_1.filterItem)(item)));
    }
    catch (e) {
        console.log(e);
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('getNextItems: Error', e));
    }
});
exports.getNextItems = getNextItems;
