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
exports.ProfileController = void 0;
const Collections_1 = require("../../db/models/Collections");
const Users_1 = require("../../db/models/Users");
class ProfileController {
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const collections = yield Collections_1.Collections.findAll({ where: { userId } });
            const user = yield Users_1.Users.findOne({
                where: { id: userId },
                attributes: ['id', 'nickname', 'avatarUrl']
            });
            res.json({ collections, user: user === null || user === void 0 ? void 0 : user.dataValues });
        });
    }
}
exports.ProfileController = ProfileController;