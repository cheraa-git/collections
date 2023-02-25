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
const utils_1 = require("../../utils");
const Tags_1 = require("../../db/models/Tags");
const itemService_1 = require("../../service/itemService");
class ItemController {
    constructor() {
        this.handlerCreateItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collectionId, fields, userId, token, tags } = req.body;
            const name = fields.name;
            if (!(0, utils_1.checkToken)(token, userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            if (!collectionId || !name || !fields) {
                return res.status(500).json({ error: 'Collection data is invalid' });
            }
            const item = yield (0, itemService_1.createItem)(userId, collectionId, fields, tags);
            res.json(item);
        });
        this.handleGetItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield (0, itemService_1.getItem)(+id);
            res.json(data);
        });
        this.handleEditItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { item, token } = req.body;
            if (!(0, utils_1.checkToken)(token, yield (0, itemService_1.getItemAuthorId)(item.collectionId))) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const editedItem = yield (0, itemService_1.editItem)(item);
            res.json(editedItem);
        });
        this.handleDeleteItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { item, token } = req.body;
            if (!(0, utils_1.checkToken)(token, yield (0, itemService_1.getItemAuthorId)(item.collectionId))) {
                return res.status(500).json({ error: 'TokenError' });
            }
            res.json(yield (0, itemService_1.deleteItem)(item.id));
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
