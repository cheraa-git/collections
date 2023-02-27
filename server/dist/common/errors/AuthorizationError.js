"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = void 0;
class AuthorizationError extends Error {
    constructor(message, error) {
        super();
        this.name = "AuthorizationError";
        this.message = message;
        this.error = error;
    }
}
exports.AuthorizationError = AuthorizationError;
