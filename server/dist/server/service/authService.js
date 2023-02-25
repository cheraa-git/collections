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
exports.checkLoginData = exports.registerUser = void 0;
const bcrypt = __importStar(require("bcrypt"));
const Users_1 = require("../db/models/Users");
const jwt = __importStar(require("jsonwebtoken"));
const SECRET_KEY = process.env.TOKEN_SECTET_KEY + '';
const registerUser = (nickname, email, avatarUrl, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashPassword = yield bcrypt.hash(password, 10);
    const newUserData = { nickname, email, password: hashPassword, avatarUrl, isAdmin: false, status: 'active' };
    const newUser = yield Users_1.Users.create(newUserData);
    const token = jwt.sign({ email, hashPassword, id: newUser.id, isAdmin: false, status: 'active' }, SECRET_KEY);
    return Object.assign(Object.assign({}, newUser.dataValues), { password: undefined, token });
});
exports.registerUser = registerUser;
const checkLoginData = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Users_1.Users.findOne({ where: { email } });
    if (!user)
        return { error: 'No user with this email was found' };
    if (user.status !== 'active')
        return { error: `StatusError: ${user.status}` };
    const comparePassword = yield bcrypt.compare(password, user.password);
    if (!comparePassword)
        return { error: 'The password is invalid', };
    return { error: '', data: user.dataValues };
});
exports.checkLoginData = checkLoginData;
