"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = void 0;
class DatabaseError extends Error {
    constructor(message, error) {
        super();
        this.name = "DatabaseError";
        this.message = message;
        this.error = error;
    }
}
exports.DatabaseError = DatabaseError;
