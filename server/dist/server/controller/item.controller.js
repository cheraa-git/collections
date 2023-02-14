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
exports.ItemController = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Items_1 = require("../db/models/Items");
const utils_1 = require("../utils");
const ItemConfigs_1 = require("../db/models/ItemConfigs");
class ItemController {
    constructor() {
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
            res.json(newItem);
        });
        this.getItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const item = yield Items_1.Items.findOne({ where: { id }, include: ItemConfigs_1.ItemConfigs });
            res.json((0, utils_1.filterItem)(item));
        });
    }
    checkToken(token, userId) {
        dotenv_1.default.config();
        const jwtPayload = jwt.verify(token, String(process.env.TOKEN_SECTET_KEY));
        return jwtPayload.id === userId;
    }
}
exports.ItemController = ItemController;
