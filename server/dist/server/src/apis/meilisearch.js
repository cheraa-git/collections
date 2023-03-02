"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchClient = void 0;
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
