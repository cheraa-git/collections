"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionController = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const Collections_1 = require("../db/models/Collections");
const ItemConfigs_1 = require("../db/models/ItemConfigs");
const dotenv_1 = __importDefault(require("dotenv"));
const Users_1 = require("../db/models/Users");
const Items_1 = require("../db/models/Items");
const utils_1 = require("../utils");
class CollectionController {
    constructor() {
        this.createCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId, token, title, description, theme, imageUrl, itemConfigs } = req.body;
            const timestamp = `${Date.now()}`;
            if (!this.checkToken(token, userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            if (!title || !description || !theme) {
                return res.status(500).json({ error: 'Collection data is invalid' });
            }
            const newCollection = yield Collections_1.Collections.create({ title, description, theme, userId, imageUrl, timestamp });
            if (itemConfigs && itemConfigs.length > 0) {
                const configs = itemConfigs.map(config => (Object.assign(Object.assign({}, config), { collectionId: newCollection.id })));
                yield ItemConfigs_1.ItemConfigs.bulkCreate(configs);
            }
            // TODO: отработать исключения при создании
            res.json(Object.assign({}, newCollection.dataValues));
        });
        this.getCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const response = yield Collections_1.Collections.findOne({
                where: { id },
                include: [
                    { model: ItemConfigs_1.ItemConfigs },
                    { model: Users_1.Users, attributes: ['nickname'] },
                    { model: Items_1.Items }
                ]
            });
            const collection = Object.assign(Object.assign({}, response === null || response === void 0 ? void 0 : response.dataValues), { userName: response === null || response === void 0 ? void 0 : response.users.nickname, itemConfigs: undefined, users: undefined, items: undefined });
            const items = response === null || response === void 0 ? void 0 : response.items.map(i => (0, utils_1.filterItem)(i));
            res.json({ collection, itemConfigs: response === null || response === void 0 ? void 0 : response.itemConfigs, items });
        });
        this.createItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collectionId, fields, userId, token, tags } = req.body;
            const name = fields.name;
            //TODO: реализовать tags
            const timestamp = `${Date.now()}`;
            if (!this.checkToken(token, userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            if (!collectionId || !name || !fields) {
                return res.status(500).json({ error: 'Collection data is invalid' });
            }
            const newItem = yield Items_1.Items.create(Object.assign({ collectionId, timestamp }, fields));
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
            if (!this.checkToken(token, itemAuthor === null || itemAuthor === void 0 ? void 0 : itemAuthor.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const updatedItem = yield Items_1.Items.update(item, { where: { id: item.id }, returning: ['*'] });
            res.json((0, utils_1.filterItem)(updatedItem[1][0]));
        });
        this.deleteItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { item, token } = req.body;
            const itemAuthor = yield Collections_1.Collections.findOne({ where: { id: item.collectionId }, attributes: ['userId'] });
            if (!this.checkToken(token, itemAuthor === null || itemAuthor === void 0 ? void 0 : itemAuthor.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const countDeletedItems = yield Items_1.Items.destroy({ where: { id: item.id }, force: true });
            res.json(countDeletedItems);
        });
        this.deleteCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collection, token } = req.body;
            if (!this.checkToken(token, collection.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const countDeletedCollections = yield Collections_1.Collections.destroy({ where: { id: collection.id }, force: true });
            res.json(countDeletedCollections);
        });
    }
    checkToken(token, userId) {
        if (!token || !userId)
            return false;
        dotenv_1.default.config();
        const jwtPayload = jwt.verify(token, String(process.env.TOKEN_SECTET_KEY));
        return jwtPayload.id === userId;
    }
}
exports.CollectionController = CollectionController;
