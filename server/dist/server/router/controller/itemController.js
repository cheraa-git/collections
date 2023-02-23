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
exports.ItemController = void 0;
const Items_1 = require("../../db/models/Items");
const utils_1 = require("../../utils");
const ItemConfigs_1 = require("../../db/models/ItemConfigs");
const Collections_1 = require("../../db/models/Collections");
const Tags_1 = require("../../db/models/Tags");
const ItemsTags_1 = require("../../db/models/ItemsTags");
class ItemController {
    constructor() {
        this.createItemTags = (tags, itemId) => __awaiter(this, void 0, void 0, function* () {
            const addedTags = tags.filter(tag => tag.id);
            const createdTags = (yield Tags_1.Tags.bulkCreate(tags.filter(tag => !tag.id))).map(tag => tag.dataValues);
            const itemTags = [...addedTags, ...createdTags].map(tag => ({ itemId, tagId: tag.id }));
            yield ItemsTags_1.ItemsTags.bulkCreate(itemTags);
            return [...addedTags, ...createdTags];
        });
        this.editItemTags = (tags, itemId) => __awaiter(this, void 0, void 0, function* () {
            yield ItemsTags_1.ItemsTags.destroy({ where: { itemId } });
            yield this.createItemTags(tags, itemId);
            return tags;
        });
        this.createItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collectionId, fields, userId, token, tags } = req.body;
            const name = fields.name;
            if (!(0, utils_1.checkToken)(token, userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            if (!collectionId || !name || !fields) {
                return res.status(500).json({ error: 'Collection data is invalid' });
            }
            const newItem = yield Items_1.Items.create(Object.assign({ collectionId, timestamp: `${Date.now()}` }, fields));
            res.json(Object.assign(Object.assign({}, (0, utils_1.filterItem)(newItem)), { tags: yield this.createItemTags(tags, newItem.id), userId }));
        });
        this.getItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id, collectionId } = req.params;
            const item = yield Items_1.Items.findOne({ where: { id }, include: [{ model: Tags_1.Tags, through: { attributes: [] } }] });
            const itemConfigs = yield ItemConfigs_1.ItemConfigs.findAll({ where: { collectionId } });
            const userId = (_a = (yield Collections_1.Collections.findOne({ where: { id: collectionId }, attributes: ['userId'] }))) === null || _a === void 0 ? void 0 : _a.userId;
            res.json({ item: Object.assign(Object.assign({}, (0, utils_1.filterItem)(item)), { userId }), itemConfigs });
        });
        this.editItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = req.body, _c = _b.item, { tags } = _c, editedItem = __rest(_c, ["tags"]), { token } = _b;
            const itemAuthor = yield Collections_1.Collections.findOne({ where: { id: editedItem.collectionId }, attributes: ['userId'] });
            if (!(0, utils_1.checkToken)(token, itemAuthor === null || itemAuthor === void 0 ? void 0 : itemAuthor.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const updatedItem = yield Items_1.Items.update(editedItem, { where: { id: editedItem.id }, returning: ['*'] });
            const updatedTags = yield this.editItemTags(tags, editedItem.id);
            res.json(Object.assign(Object.assign({}, (0, utils_1.filterItem)(updatedItem[1][0])), { tags: updatedTags }));
        });
        this.deleteItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { item, token } = req.body;
            const itemAuthor = yield Collections_1.Collections.findOne({ where: { id: item.collectionId }, attributes: ['userId'] });
            if (!(0, utils_1.checkToken)(token, itemAuthor === null || itemAuthor === void 0 ? void 0 : itemAuthor.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const countDeletedItems = yield Items_1.Items.destroy({ where: { id: item.id }, force: true });
            res.json(countDeletedItems);
        });
    }
    getTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield Tags_1.Tags.findAll();
            res.json(tags);
        });
    }
}
exports.ItemController = ItemController;
