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
exports.editAvatar = exports.editProfileByProvider = exports.editProfileByToken = exports.getProfile = void 0;
const Collections_1 = require("../db/models/Collections");
const Users_1 = require("../db/models/Users");
const either_1 = require("@sweet-monads/either");
const DatabaseError_1 = require("../../../common/errors/DatabaseError");
const tokenService_1 = require("./tokenService");
const sequelize_1 = require("sequelize");
const getProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield Collections_1.Collections.findAll({ where: { userId }, order: sequelize_1.Sequelize.literal('timestamp DESC') });
        const user = yield Users_1.Users.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] }
        });
        return (0, either_1.right)({ collections, user: user === null || user === void 0 ? void 0 : user.dataValues });
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('Get profile error', e));
    }
});
exports.getProfile = getProfile;
const editProfileByToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, tokenService_1.parseEditProfileToken)(token)
            .asyncMap((tokenData) => __awaiter(void 0, void 0, void 0, function* () {
            const userData = Object.assign(Object.assign({}, tokenData), { adminEmail: undefined, oldEmail: undefined });
            const user = yield Users_1.Users.update(userData, { where: { email: tokenData.oldEmail }, returning: ['*'] });
            return user[1][0].id;
        }));
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('editProfile: Error', e));
    }
});
exports.editProfileByToken = editProfileByToken;
const editProfileByProvider = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = data, userData = __rest(data, ["email"]);
        const user = (yield Users_1.Users.update(userData, { where: { email }, returning: ['*'] }))[1][0];
        return (0, either_1.right)(user);
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('editProfile: Error', e));
    }
});
exports.editProfileByProvider = editProfileByProvider;
const editAvatar = (userId, avatar) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = (yield Users_1.Users.update({ avatarUrl: avatar }, {
            where: { id: userId },
            returning: ['avatarUrl']
        }))[1][0];
        return (0, either_1.right)({ avatarUrl: updatedUser.avatarUrl });
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('editAvatar: Error', e));
    }
});
exports.editAvatar = editAvatar;
