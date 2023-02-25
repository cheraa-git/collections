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
exports.setAdminStatus = exports.setUsersStatus = exports.getUsers = void 0;
const Users_1 = require("../db/models/Users");
const sequelize_typescript_1 = require("sequelize-typescript");
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Users_1.Users.findAll({
        attributes: { exclude: ['password'] },
        order: [sequelize_typescript_1.Sequelize.literal('id DESC')]
    });
});
exports.getUsers = getUsers;
const setUsersStatus = (status, ids) => __awaiter(void 0, void 0, void 0, function* () {
    yield Users_1.Users.update({ status }, { where: { id: ids } });
});
exports.setUsersStatus = setUsersStatus;
const setAdminStatus = (status, ids) => __awaiter(void 0, void 0, void 0, function* () {
    yield Users_1.Users.update({ isAdmin: status }, { where: { id: ids } });
});
exports.setAdminStatus = setAdminStatus;
