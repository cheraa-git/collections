"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSocket = void 0;
const Comments_1 = require("../../db/models/Comments");
const Users_1 = require("../../db/models/Users");
const utils_1 = require("../../utils");
const tokenService_1 = require("../../service/tokenService");
class CommentSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.getComments = (itemId) => __awaiter(this, void 0, void 0, function* () {
            this.socket.join(`item:${itemId}`);
            const comments = yield Comments_1.Comments.findAll({
                where: { itemId },
                include: [{ model: Users_1.Users, attributes: ['nickname'] }]
            });
            this.socket.emit('comments', comments.map(c => (0, utils_1.flatJoinedModel)(c, [c.users])));
        });
        this.addComment = ({ userId, itemId, text, nickname, token, }) => __awaiter(this, void 0, void 0, function* () {
            if (!(0, tokenService_1.checkToken)(token, userId)) {
                return this.socket.emit('token_error');
            }
            const newComment = yield Comments_1.Comments.create({ userId, itemId, text, timestamp: `${Date.now()}` });
            this.io.to(`item:${itemId}`).emit('new_comment', Object.assign(Object.assign({}, newComment.dataValues), { nickname }));
        });
    }
    onEvents() {
        this.socket.on('get:comments', this.getComments);
        this.socket.on('add:comment', this.addComment);
    }
}
exports.CommentSocket = CommentSocket;
