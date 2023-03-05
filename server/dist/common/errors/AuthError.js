"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = void 0;
class AuthError extends Error {
    constructor(message, error) {
        super();
        this.name = "AuthError";
        this.message = message;
        this.error = error;
    }
}
exports.AuthError = AuthError;
