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
const utils_1 = require("../../utils");
const Themes_1 = require("../../db/models/Themes");
const collectionService_1 = require("../../service/collectionService");
class CollectionController {
    constructor() {
        this.handleCreateCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { token, itemConfigs } = _a, collection = __rest(_a, ["token", "itemConfigs"]);
            const timestamp = `${Date.now()}`;
            if (!(0, utils_1.checkToken)(token, collection.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            if (!collection.title || !collection.description || !collection.themeId) {
                return res.status(500).json({ error: 'Collection data is invalid' });
            }
            const newCollection = yield (0, collectionService_1.createCollection)(Object.assign(Object.assign({}, collection), { timestamp }), itemConfigs);
            res.json(newCollection);
        });
        this.handleGetCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            res.json(yield (0, collectionService_1.getCollection)(id));
        });
        this.handleDeleteCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collection, token } = req.body;
            if (!(0, utils_1.checkToken)(token, collection.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            res.json(yield (0, collectionService_1.deleteCollection)(collection.id));
        });
        this.handleEditCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collection, token, itemConfigs } = req.body;
            if (!(0, utils_1.checkToken)(token, collection.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            res.json(yield (0, collectionService_1.editCollection)(collection, itemConfigs));
        });
        this.getThemes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.json(yield Themes_1.Themes.findAll());
        });
    }
}
exports.CollectionController = CollectionController;
