"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexingError = void 0;
class IndexingError extends Error {
    constructor(message, error) {
        super();
        this.name = 'IndexingError';
        this.message = message;
        this.error = error;
    }
}
exports.IndexingError = IndexingError;
