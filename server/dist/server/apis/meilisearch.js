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
exports.meiliSearchSetup = exports.SearchClient = void 0;
const meilisearch_1 = require("meilisearch");
class SearchClient extends meilisearch_1.MeiliSearch {
    constructor() {
        super({
            host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
            apiKey: process.env.MEILISEARCH_API_KEY,
        });
    }
}
exports.SearchClient = SearchClient;
const meiliSearchSetup = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new SearchClient();
    try {
        // await client.deleteIndex('items')
        // await client.deleteIndex('collections')
        // await client.deleteIndex('comments')
        yield client.createIndex('items', { primaryKey: 'id' });
        yield client.createIndex('collections', { primaryKey: 'id' });
        yield client.createIndex('comments', { primaryKey: 'id' });
        const itemsIndex = client.index('items');
        const commentsIndex = client.index('comments');
        const collectionsIndex = client.index('collections');
        yield itemsIndex.updateSearchableAttributes(['name', 'str1', 'txt1', 'str2', 'txt2', 'str3', 'txt3']);
        yield commentsIndex.updateSearchableAttributes(['text']);
        yield collectionsIndex.updateSearchableAttributes(['title', 'description']);
        console.log('Setup MeiliSearch is complete');
    }
    catch (e) {
        console.log('Setup MeiliSearch ERROR', e);
    }
});
exports.meiliSearchSetup = meiliSearchSetup;
