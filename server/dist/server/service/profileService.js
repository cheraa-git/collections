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
exports.editAvatar = exports.editProfile = exports.getProfile = void 0;
const Collections_1 = require("../db/models/Collections");
const Users_1 = require("../db/models/Users");
const either_1 = require("@sweet-monads/either");
const DatabaseError_1 = require("../../common/errors/DatabaseError");
const tokenService_1 = require("./tokenService");
const getProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collections = yield Collections_1.Collections.findAll({ where: { userId } });
        const user = yield Users_1.Users.findOne({
            where: { id: userId },
            attributes: ['id', 'nickname', 'avatarUrl']
        });
        return (0, either_1.right)({ collections, user: user === null || user === void 0 ? void 0 : user.dataValues });
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('Get profile error', e));
    }
});
exports.getProfile = getProfile;
const editProfile = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, tokenService_1.parseEditProfileToken)(token)
            .asyncMap((userData) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield Users_1.Users.update(userData, { where: { email: userData.oldEmail }, returning: ['*'] });
            return user[1][0].id;
        }));
    }
    catch (e) {
        return (0, either_1.left)(new DatabaseError_1.DatabaseError('editProfile: Error', e));
    }
});
exports.editProfile = editProfile;
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
