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
const utils_1 = require("../../utils");
const adminService_1 = require("../../service/adminService");
const searchService_1 = require("../../service/searchService");
class AdminController {
    constructor() {
        this.handleGetUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.json(yield (0, adminService_1.getUsers)());
        });
        this.handleSetUsersStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, userIds, status } = req.body;
            if (!(0, utils_1.checkAdminToken)(token))
                res.status(500).json({ error: 'TokenError' });
            yield (0, adminService_1.setUsersStatus)(status, userIds);
            res.json(userIds);
        });
        this.handleSetAdminStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, userIds, status } = req.body;
            if (!(0, utils_1.checkAdminToken)(token))
                res.status(500).json({ error: 'TokenError' });
            yield (0, adminService_1.setAdminStatus)(status, userIds);
            res.json(userIds);
        });
        this.indexingItemsHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            if (!(0, utils_1.checkAdminToken)(token))
                res.status(500).json({ error: 'TokenError' });
            try {
                yield (0, searchService_1.indexingAllItems)();
                res.json({ status: 'success' });
            }
            catch (err) {
                console.log("IndexingItemsError:", err);
                res.status(500).json({ error: 'IndexingItemsError' });
            }
        });
        this.indexingCommentsHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            if (!(0, utils_1.checkAdminToken)(token))
                res.status(500).json({ error: 'TokenError' });
            try {
                yield (0, searchService_1.indexingAllComments)();
                res.json({ status: 'success' });
            }
            catch (err) {
                console.log("IndexingCommentsError:", err);
                res.status(500).json({ error: 'IndexingCommentsError' });
            }
        });
        this.indexingCollectionsHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            if (!(0, utils_1.checkAdminToken)(token))
                res.status(500).json({ error: 'TokenError' });
            try {
                yield (0, searchService_1.indexingAllCollections)();
                res.json({ status: 'success' });
            }
            catch (err) {
                console.log("IndexingCollectionsError:", err);
                res.status(500).json({ error: 'IndexingCollectionsError' });
            }
        });
    }
}
exports.default = AdminController;
