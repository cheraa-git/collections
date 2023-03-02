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
const adminService_1 = require("../../service/adminService");
const searchService_1 = require("../../service/searchService");
const TokenError_1 = require("../../../../common/errors/TokenError");
const tokenService_1 = require("../../service/tokenService");
class AdminController {
    constructor() {
        this.handleGetUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            (yield (0, adminService_1.getUsers)())
                .mapRight(users => res.json(users))
                .mapLeft(error => res.status(500).json(error));
        });
        this.handleSetUsersStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, userIds, status } = req.body;
            if (!(0, tokenService_1.checkAdminToken)(token))
                return res.status(498).json(new TokenError_1.TokenError());
            const response = yield (0, adminService_1.setUsersStatus)(status, userIds);
            response
                .mapRight(() => res.json(userIds))
                .mapLeft(e => res.status(500).json(e));
        });
        this.handleSetAdminStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, userIds, status } = req.body;
            if (!(0, tokenService_1.checkAdminToken)(token))
                return res.status(498).json(new TokenError_1.TokenError());
            const response = yield (0, adminService_1.setAdminStatus)(status, userIds);
            response
                .mapRight(() => res.json(userIds))
                .mapLeft(e => res.status(500).json(e));
        });
        this.indexingItemsHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            if (!(0, tokenService_1.checkAdminToken)(token))
                return res.status(498).json(new TokenError_1.TokenError());
            const response = yield (0, searchService_1.indexingAllItems)();
            response
                .mapRight(r => res.json(r))
                .mapLeft(e => res.status(500).json(e));
        });
        this.indexingCommentsHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            if (!(0, tokenService_1.checkAdminToken)(token))
                return res.status(498).json(new TokenError_1.TokenError());
            const response = yield (0, searchService_1.indexingAllComments)();
            response
                .mapRight(r => res.json(r))
                .mapLeft(e => res.status(500).json(e));
        });
        this.indexingCollectionsHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            if (!(0, tokenService_1.checkAdminToken)(token))
                return res.status(498).json(new TokenError_1.TokenError());
            const response = yield (0, searchService_1.indexingAllCollections)();
            response
                .mapRight(r => res.json(r))
                .mapLeft(e => res.status(500).json(e));
        });
    }
}
exports.default = AdminController;
