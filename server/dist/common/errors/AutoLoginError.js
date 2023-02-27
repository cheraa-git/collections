"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoLoginError = void 0;
class AutoLoginError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'AutoLoginError';
    }
}
exports.AutoLoginError = AutoLoginError;
