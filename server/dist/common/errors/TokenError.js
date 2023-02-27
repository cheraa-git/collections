"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenError = void 0;
class TokenError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'TokenError';
    }
}
exports.TokenError = TokenError;
