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
exports.DevController = void 0;
const meilisearch_1 = require("../../apis/meilisearch");
const searchService_1 = require("../../service/searchService");
class DevController {
    meiliSearchSetup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = req.body.password;
            if (password !== process.env.DEVELOPER_PASSWORD)
                return res.status(500).json({ error: 'password invalid' });
            const client = new meilisearch_1.SearchClient();
            try {
                yield client.createIndex('items', { primaryKey: 'id' });
                yield client.createIndex('collections', { primaryKey: 'id' });
                yield client.createIndex('comments', { primaryKey: 'id' });
                const itemsIndex = client.index('items');
                const commentsIndex = client.index('comments');
                const collectionsIndex = client.index('collections');
                yield itemsIndex.updateSearchableAttributes(['name', 'str1', 'txt1', 'str2', 'txt2', 'str3', 'txt3']);
                yield commentsIndex.updateSearchableAttributes(['text']);
                yield collectionsIndex.updateSearchableAttributes(['title', 'description']);
                res.json({ status: 'completed' });
            }
            catch (e) {
                res.status(500).json(e);
            }
        });
    }
    indexingCollections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = req.body.password;
            if (password !== process.env.DEVELOPER_PASSWORD)
                return res.status(500).json({ error: 'password invalid' });
            const response = yield (0, searchService_1.indexingAllCollections)();
            response
                .mapRight(r => res.json(r))
                .mapLeft(e => res.status(500).json(e));
        });
    }
    indexingComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = req.body.password;
            if (password !== process.env.DEVELOPER_PASSWORD)
                return res.status(500).json({ error: 'password invalid' });
            const response = yield (0, searchService_1.indexingAllComments)();
            response
                .mapRight(r => res.json(r))
                .mapLeft(e => res.status(500).json(e));
        });
    }
    indexingItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = req.body.password;
            if (password !== process.env.DEVELOPER_PASSWORD)
                return res.status(500).json({ error: 'password invalid' });
            const response = yield (0, searchService_1.indexingAllItems)();
            response
                .mapRight(r => res.json(r))
                .mapLeft(e => res.status(500).json(e));
        });
    }
}
exports.DevController = DevController;
