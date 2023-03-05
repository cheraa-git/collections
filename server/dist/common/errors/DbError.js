"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbError = void 0;
class DbError extends Error {
    constructor(message, error) {
        super();
        this.name = "DbError";
        this.message = message;
        this.error = error;
    }
}
exports.DbError = DbError;
