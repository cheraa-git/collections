"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexError = void 0;
class IndexError extends Error {
    constructor(message, error) {
        super();
        this.name = 'IndexError';
        this.message = message;
        this.error = error;
    }
}
exports.IndexError = IndexError;
