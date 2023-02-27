"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = void 0;
class DatabaseError extends Error {
    constructor() {
        super(...arguments);
        this.name = "DatabaseError";
        // constructor(message?:string) {
        //   super(message)
        //   // this.message = message || ''
        // }
    }
}
exports.DatabaseError = DatabaseError;
