"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message, error) {
        super();
        this.name = 'NotFoundError';
        this.message = message;
    }
}
exports.NotFoundError = NotFoundError;
