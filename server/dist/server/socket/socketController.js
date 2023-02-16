"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketController = void 0;
const commentSocket_1 = require("./sockets/commentSocket");
class SocketController {
    constructor(io) {
        this.io = io;
    }
    connect() {
        this.io.on('connection', (socket) => {
            new commentSocket_1.CommentSocket(this.io, socket);
        });
    }
}
exports.SocketController = SocketController;
