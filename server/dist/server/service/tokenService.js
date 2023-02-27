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
exports.createToken = exports.checkAdminToken = exports.checkAutoLoginToken = exports.checkToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = __importStar(require("jsonwebtoken"));
const TOKEN_SECRET_KEY = String(process.env.TOKEN_SECTET_KEY);
const checkToken = (token, userId) => {
    if (!token || !userId)
        return false;
    dotenv_1.default.config();
    try {
        const jwtPayload = jwt.verify(token, TOKEN_SECRET_KEY);
        return (jwtPayload.id === userId || jwtPayload.isAdmin) && jwtPayload.status === 'active';
    }
    catch (e) {
        return false;
    }
};
exports.checkToken = checkToken;
const checkAutoLoginToken = (token) => {
    try {
        const jwtPayload = jwt.verify(token, TOKEN_SECRET_KEY);
        const iat = jwtPayload.iat;
        const isExpired = (((iat + 3600) * 24) * 1000) < Date.now();
        const statusIsAvailable = jwtPayload.status === 'active';
        const isAvailable = isExpired && statusIsAvailable;
        return { email: jwtPayload.email, hashPassword: jwtPayload.hashPassword, isAvailable };
    }
    catch (e) {
        return { email: '', hashPassword: '', isAvailable: false };
    }
};
exports.checkAutoLoginToken = checkAutoLoginToken;
const checkAdminToken = (token) => {
    if (!token)
        return false;
    dotenv_1.default.config();
    try {
        const jwtPayload = jwt.verify(token, TOKEN_SECRET_KEY);
        return jwtPayload.isAdmin && jwtPayload.status === 'active';
    }
    catch (e) {
        return false;
    }
};
exports.checkAdminToken = checkAdminToken;
const createToken = (user) => {
    return jwt.sign({
        email: user.email,
        hashPassword: user.password,
        id: user.id,
        isAdmin: user.isAdmin,
        status: user.status
    }, TOKEN_SECRET_KEY);
};
exports.createToken = createToken;
