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
const Tags_1 = require("../../db/models/Tags");
const itemService_1 = require("../../service/itemService");
const tokenService_1 = require("../../service/tokenService");
const TokenError_1 = require("../../../common/errors/TokenError");
const DatabaseError_1 = require("../../../common/errors/DatabaseError");
class ItemController {
    constructor() {
        this.handlerCreateItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collectionId, fields, userId, token, tags } = req.body;
            if (!(0, tokenService_1.checkToken)(token, userId))
                return res.status(498).json(new TokenError_1.TokenError());
            return (yield (0, itemService_1.createItem)(userId, collectionId, fields, tags))
                .mapRight(item => res.json(item))
                .mapLeft(e => res.status(500).json(e));
        });
        this.handleGetItem = ({ params: { id } }, res) => __awaiter(this, void 0, void 0, function* () {
            return (yield (0, itemService_1.getItem)(+id))
                .mapRight(data => res.json(data))
                .mapLeft(e => res.status(500).json(e));
        });
        this.handleEditItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { item, token } = req.body;
            if (!(0, tokenService_1.checkToken)(token, yield (0, itemService_1.getItemAuthorId)(item.collectionId))) {
                return res.status(498).json(new TokenError_1.TokenError());
            }
            return (yield (0, itemService_1.editItem)(item))
                .mapRight(editedItem => res.json(editedItem))
                .mapLeft(e => res.status(500).json(e));
        });
        this.handleDeleteItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { item, token } = req.body;
            if (!(0, tokenService_1.checkToken)(token, yield (0, itemService_1.getItemAuthorId)(item.collectionId))) {
                return res.status(498).json(new TokenError_1.TokenError());
            }
            return (yield (0, itemService_1.deleteItem)(item.id))
                .mapRight(r => res.json(r))
                .mapLeft(e => res.status(500).json(e));
        });
    }
    getTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.json(yield Tags_1.Tags.findAll());
            }
            catch (e) {
                res.status(500).json(new DatabaseError_1.DatabaseError('Get tags error', e));
            }
        });
    }
    handleGetNextItems({ query: { offset, limit, tagIds } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!offset || !limit)
                return res.json([]);
            const parsedTagIds = tagIds ? JSON.parse(tagIds) : undefined;
            const itemsResponse = yield (0, itemService_1.getNextItems)(Number(offset), Number(limit), parsedTagIds);
            itemsResponse
                .mapRight(items => res.json(items))
                .mapLeft(e => res.status(500).json(e));
        });
    }
    handleGetMostPopularTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, itemService_1.getMostPopularTags)();
            response
                .mapRight(r => res.json(r))
                .mapLeft(e => res.status(500).json(e));
        });
    }
}
exports.ItemController = ItemController;
