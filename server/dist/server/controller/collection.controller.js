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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionController = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const Collections_1 = require("../db/models/Collections");
const ItemConfigs_1 = require("../db/models/ItemConfigs");
const dotenv_1 = require("dotenv");
const Users_1 = require("../db/models/Users");
(0, dotenv_1.config)();
const SECRET_KEY = process.env.TOKEN_SECTET_KEY + '';
class CollectionController {
    createCollection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, token, title, description, theme, imageUrl, itemConfigs } = req.body;
            const jwtPayload = jwt.verify(token, SECRET_KEY);
            if (jwtPayload.id !== userId) {
                return res.status(500).json({ error: 'TokenError' });
            }
            if (!title || !description || !theme) {
                return res.status(500).json({ error: 'Collection data is invalid' });
            }
            const newCollection = yield Collections_1.Collections.create({ title, description, theme, userId, imageUrl });
            if (itemConfigs && itemConfigs.length > 0) {
                const configs = itemConfigs.map(config => (Object.assign(Object.assign({}, config), { collectionId: newCollection.id })));
                yield ItemConfigs_1.ItemConfigs.bulkCreate(configs);
            }
            // TODO: отработать исключения при создании
            res.json(Object.assign({}, newCollection.dataValues));
        });
    }
    getCollection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const response = yield Collections_1.Collections.findOne({
                where: { id },
                include: [
                    { model: ItemConfigs_1.ItemConfigs },
                    {
                        model: Users_1.Users,
                        attributes: ['nickname']
                    }
                ]
            });
            const collection = Object.assign(Object.assign({}, response === null || response === void 0 ? void 0 : response.dataValues), { userName: response === null || response === void 0 ? void 0 : response.users.nickname, itemConfigs: undefined, users: undefined });
            const itemConfigs = response === null || response === void 0 ? void 0 : response.itemConfigs;
            res.json({ collection, itemConfigs });
        });
    }
}
exports.CollectionController = CollectionController;
