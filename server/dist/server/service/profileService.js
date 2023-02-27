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
exports.getProfile = void 0;
const Collections_1 = require("../db/models/Collections");
const Users_1 = require("../db/models/Users");
const either_1 = require("@sweet-monads/either");
const DatabaseError_1 = require("../../common/errors/DatabaseError");
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