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
exports.ItemController = void 0;
const Items_1 = require("../db/models/Items");
const utils_1 = require("../utils");
const ItemConfigs_1 = require("../db/models/ItemConfigs");
const Collections_1 = require("../db/models/Collections");
const Comments_1 = require("../db/models/Comments");
class ItemController {
    constructor() {
        this.createItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collectionId, fields, userId, token, tags } = req.body;
            const name = fields.name;
            //TODO: реализовать tags
            if ((0, utils_1.checkToken)(token, userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            if (!collectionId || !name || !fields) {
                return res.status(500).json({ error: 'Collection data is invalid' });
            }
            const newItem = yield Items_1.Items.create(Object.assign({ collectionId, timestamp: `${Date.now()}` }, fields));
            res.json((0, utils_1.filterItem)(newItem));
        });
        this.getItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, collectionId } = req.params;
            const item = yield Items_1.Items.findOne({ where: { id } });
            const itemConfigs = yield ItemConfigs_1.ItemConfigs.findAll({ where: { collectionId } });
            res.json({ item: (0, utils_1.filterItem)(item), itemConfigs });
        });
        this.editItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { item, token } = req.body;
            const itemAuthor = yield Collections_1.Collections.findOne({ where: { id: item.collectionId }, attributes: ['userId'] });
            if ((0, utils_1.checkToken)(token, itemAuthor === null || itemAuthor === void 0 ? void 0 : itemAuthor.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const updatedItem = yield Items_1.Items.update(item, { where: { id: item.id }, returning: ['*'] });
            res.json((0, utils_1.filterItem)(updatedItem[1][0]));
        });
        this.deleteItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { item, token } = req.body;
            const itemAuthor = yield Collections_1.Collections.findOne({ where: { id: item.collectionId }, attributes: ['userId'] });
            if ((0, utils_1.checkToken)(token, itemAuthor === null || itemAuthor === void 0 ? void 0 : itemAuthor.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const countDeletedItems = yield Items_1.Items.destroy({ where: { id: item.id }, force: true });
            res.json(countDeletedItems);
        });
        this.addComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId, token, itemId, text } = req.body;
            if ((0, utils_1.checkToken)(token, userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const newComment = yield Comments_1.Comments.create({ userId, itemId, text, timestamp: `${Date.now()}` });
            res.json(newComment.dataValues);
        });
    }
}
exports.ItemController = ItemController;
