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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatJoinedModel = exports.checkAdminToken = exports.checkToken = exports.filterItem = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = __importStar(require("jsonwebtoken"));
const filterItem = (item) => {
    if (!item)
        return {};
    const filterItem = {};
    Object.entries(item === null || item === void 0 ? void 0 : item.dataValues).forEach(([key, value]) => {
        if (value) {
            filterItem[key] = value;
        }
    });
    return filterItem;
};
exports.filterItem = filterItem;
const checkToken = (token, userId) => {
    var _a;
    if (!token || !userId)
        return false;
    dotenv_1.default.config();
    const jwtPayload = jwt.verify(token, String(process.env.TOKEN_SECTET_KEY));
    return (_a = (jwtPayload.id === userId || jwtPayload.isAdmin)) !== null && _a !== void 0 ? _a : jwtPayload.status === 'active';
};
exports.checkToken = checkToken;
const checkAdminToken = (token) => {
    if (!token)
        return false;
    dotenv_1.default.config();
    const jwtPayload = jwt.verify(token, String(process.env.TOKEN_SECTET_KEY));
    return jwtPayload.isAdmin && jwtPayload.status === 'active';
};
exports.checkAdminToken = checkAdminToken;
const flatJoinedModel = (obj, from) => {
    let flatObj = {};
    Object.entries(obj === null || obj === void 0 ? void 0 : obj.dataValues).forEach(([key, value]) => {
        if (typeof value !== "object") {
            flatObj[key] = value;
        }
    });
    const joinedValues = from.reduce((acc, model) => (Object.assign(Object.assign({}, acc), model === null || model === void 0 ? void 0 : model.dataValues)), {});
    return Object.assign(Object.assign({}, flatObj), joinedValues);
};
exports.flatJoinedModel = flatJoinedModel;
