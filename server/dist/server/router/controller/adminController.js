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
const Users_1 = require("../../db/models/Users");
const utils_1 = require("../../utils");
const sequelize_typescript_1 = require("sequelize-typescript");
class AdminController {
    constructor() {
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield Users_1.Users.findAll({ attributes: { exclude: ['password'] }, order: [sequelize_typescript_1.Sequelize.literal('id DESC')] });
            res.json(users);
        });
        this.setStatusUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, userIds, status } = req.body;
            if (!(0, utils_1.checkAdminToken)(token))
                res.status(500).json({ error: 'TokenError' });
            yield Users_1.Users.update({ status }, { where: { id: userIds } });
            res.json(userIds);
        });
        this.setAdminStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, userIds, status } = req.body;
            if (!(0, utils_1.checkAdminToken)(token))
                res.status(500).json({ error: 'TokenError' });
            yield Users_1.Users.update({ isAdmin: status }, { where: { id: userIds } });
            res.json(userIds);
        });
    }
}
exports.default = AdminController;
