"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailError = void 0;
class GmailError extends Error {
    constructor(message, error) {
        super();
        this.name = "GmailError";
        this.message = message;
        this.error = error;
    }
}
exports.GmailError = GmailError;
