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
exports.authByProvider = exports.checkLoginData = exports.checkRegisterData = exports.registerUser = void 0;
const bcrypt = __importStar(require("bcrypt"));
const Users_1 = require("../db/models/Users");
const either_1 = require("@sweet-monads/either");
const AuthError_1 = require("../../../common/errors/AuthError");
const DbError_1 = require("../../../common/errors/DbError");
const tokenService_1 = require("./tokenService");
const registerUser = (nickname, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashPassword = yield bcrypt.hash(password, 10);
        const newUserData = { nickname, email, password: hashPassword, isAdmin: false, status: 'active' };
        const newUser = yield Users_1.Users.create(newUserData);
        const token = (0, tokenService_1.createToken)(newUser);
        return (0, either_1.right)(Object.assign(Object.assign({}, newUser.dataValues), { password: undefined, token }));
    }
    catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return (0, either_1.left)(new AuthError_1.AuthError(`${e.errors[0].path} already exists`));
        }
        else
            return (0, either_1.left)(new DbError_1.DbError('Register user error', e));
    }
});
exports.registerUser = registerUser;
const checkRegisterData = (email, nickname) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailMach = yield Users_1.Users.findOne({ where: { email } });
        const nicknameMach = yield Users_1.Users.findOne({ where: { nickname } });
        if (emailMach)
            return (0, either_1.left)(new AuthError_1.AuthError(`email already exists`));
        if (nicknameMach)
            return (0, either_1.left)(new AuthError_1.AuthError(`nickname already exists`));
        return (0, either_1.right)('');
    }
    catch (e) {
        return (0, either_1.left)(new DbError_1.DbError('checkRegisterData: Error', e));
    }
});
exports.checkRegisterData = checkRegisterData;
const checkLoginData = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Users_1.Users.findOne({ where: { email } });
        if (!user)
            return (0, either_1.left)(new AuthError_1.AuthError('No user with this email was found'));
        if (user.status !== 'active')
            return (0, either_1.left)(new AuthError_1.AuthError(`The user is ${user.status}`));
        const comparePassword = yield bcrypt.compare(password, user.password);
        if (!comparePassword)
            return (0, either_1.left)(new AuthError_1.AuthError('The password is invalid'));
        return (0, either_1.right)(user.dataValues);
    }
    catch (e) {
        return (0, either_1.left)(new DbError_1.DbError('Check login data error', e));
    }
});
exports.checkLoginData = checkLoginData;
const authByProvider = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { authProvider, nickname, email } = data;
    try {
        let [user, created] = yield Users_1.Users.findOrCreate({
            where: { email },
            defaults: { email, nickname, authProvider, isAdmin: false, status: 'active' },
        });
        if (!created && (!user.authProvider || user.authProvider !== authProvider)) {
            user = (yield Users_1.Users.update({ authProvider }, { where: { email }, returning: ['*'] }))[1][0];
        }
        const token = (0, tokenService_1.createToken)(user);
        return (0, either_1.right)(Object.assign(Object.assign({}, user.dataValues), { token, password: undefined }));
    }
    catch (e) {
        return (0, either_1.left)(new DbError_1.DbError('authUserByProvider: Error', e));
    }
});
exports.authByProvider = authByProvider;
