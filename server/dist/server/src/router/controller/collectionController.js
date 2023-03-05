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
exports.CollectionController = void 0;
const Themes_1 = require("../../db/models/Themes");
const collectionService_1 = require("../../service/collectionService");
const tokenService_1 = require("../../service/tokenService");
const TokenError_1 = require("../../../../common/errors/TokenError");
const DbError_1 = require("../../../../common/errors/DbError");
const sequelize_1 = require("sequelize");
class CollectionController {
    constructor() {
        this.handleCreateCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { token, itemConfigs } = _a, collection = __rest(_a, ["token", "itemConfigs"]);
            const timestamp = `${Date.now()}`;
            if (!(0, tokenService_1.checkToken)(token, collection.userId))
                return res.status(500).json(new TokenError_1.TokenError());
            return (yield (0, collectionService_1.createCollection)(Object.assign(Object.assign({}, collection), { timestamp }), itemConfigs))
                .mapRight(newCollection => res.json(newCollection))
                .mapLeft(e => res.status(500).json(e));
        });
        this.handleGetCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            return (yield (0, collectionService_1.getCollection)(id))
                .mapRight(data => res.json(data))
                .mapLeft(e => res.status(500).json(e));
        });
        this.handleDeleteCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collection, token } = req.body;
            if (!(0, tokenService_1.checkToken)(token, collection.userId))
                return res.status(500).json(new TokenError_1.TokenError());
            return (yield (0, collectionService_1.deleteCollection)(collection.id))
                .mapRight(n => res.json(n))
                .mapLeft(e => res.status(500).json(e));
        });
        this.handleEditCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, collection, itemConfigs, removedConfigs } = req.body;
            if (!(0, tokenService_1.checkToken)(token, collection.userId))
                return res.status(500).json(new TokenError_1.TokenError());
            return (yield (0, collectionService_1.editCollection)({ collection, itemConfigs, removedConfigs }))
                .mapRight(data => res.json(data))
                .mapLeft(e => res.status(500).json(e));
        });
        this.getThemes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.json(yield Themes_1.Themes.findAll({ order: sequelize_1.Sequelize.literal('name') }));
            }
            catch (e) {
                res.status(500).json(new DbError_1.DbError('Get themes', e));
            }
        });
    }
    handleGetNextCollections({ query: { offset, limit, themeId } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!offset || !limit)
                return res.json([]);
            const collectionsResponse = yield (0, collectionService_1.getNextCollections)(Number(offset), Number(limit), Number(themeId));
            collectionsResponse
                .mapRight(items => res.json(items))
                .mapLeft(e => res.status(500).json(e));
        });
    }
}
exports.CollectionController = CollectionController;
