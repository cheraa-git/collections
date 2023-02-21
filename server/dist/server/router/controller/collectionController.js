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
exports.CollectionController = void 0;
const Collections_1 = require("../../db/models/Collections");
const ItemConfigs_1 = require("../../db/models/ItemConfigs");
const Users_1 = require("../../db/models/Users");
const Items_1 = require("../../db/models/Items");
const utils_1 = require("../../utils");
const Themes_1 = require("../../db/models/Themes");
const Tags_1 = require("../../db/models/Tags");
class CollectionController {
    constructor() {
        this.createCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId, token, title, description, themeId, imageUrl, itemConfigs } = req.body;
            const timestamp = `${Date.now()}`;
            if (!(0, utils_1.checkToken)(token, userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            if (!title || !description || !themeId) {
                return res.status(500).json({ error: 'Collection data is invalid' });
            }
            const newCollection = yield Collections_1.Collections.create({ title, description, themeId, userId, imageUrl, timestamp });
            if (itemConfigs && itemConfigs.length > 0) {
                const configs = itemConfigs.map(config => (Object.assign(Object.assign({}, config), { collectionId: newCollection.id })));
                yield ItemConfigs_1.ItemConfigs.bulkCreate(configs);
            }
            //TODO: отработать исключения при создании
            res.json(Object.assign({}, newCollection.dataValues));
        });
        this.getCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const response = yield Collections_1.Collections.findOne({
                where: { id },
                include: [
                    { model: ItemConfigs_1.ItemConfigs },
                    { model: Users_1.Users, attributes: ['nickname'] },
                    { model: Items_1.Items, include: [{ model: Tags_1.Tags, through: { attributes: [] } }] }
                ]
            });
            const collection = Object.assign(Object.assign({}, response === null || response === void 0 ? void 0 : response.dataValues), { userName: response === null || response === void 0 ? void 0 : response.users.nickname, itemConfigs: undefined, users: undefined, items: undefined });
            const items = response === null || response === void 0 ? void 0 : response.items.map(i => (0, utils_1.filterItem)(i));
            res.json({ collection, itemConfigs: response === null || response === void 0 ? void 0 : response.itemConfigs, items });
        });
        this.deleteCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collection, token } = req.body;
            if ((0, utils_1.checkToken)(token, collection.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const countDeletedCollections = yield Collections_1.Collections.destroy({ where: { id: collection.id }, force: true });
            res.json(countDeletedCollections);
        });
        this.editCollection = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collection, token, itemConfigs } = req.body;
            if (!(0, utils_1.checkToken)(token, collection.userId)) {
                return res.status(500).json({ error: 'TokenError' });
            }
            const editedCollection = yield Collections_1.Collections.update(collection, { where: { id: collection.id }, returning: ['*'] });
            console.log('ITEM_CONFIGS', itemConfigs);
            const editedConfigs = yield ItemConfigs_1.ItemConfigs.bulkCreate(itemConfigs, {
                updateOnDuplicate: ['type', 'label'],
                returning: ['*']
            });
            res.json({ collection: editedCollection[1][0], itemConfigs: editedConfigs });
        });
        this.getThemes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const themes = yield Themes_1.Themes.findAll();
            res.json(themes);
        });
    }
}
exports.CollectionController = CollectionController;
