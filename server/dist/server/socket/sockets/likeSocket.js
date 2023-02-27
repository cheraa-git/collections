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
exports.LikeSocket = void 0;
const Likes_1 = require("../../db/models/Likes");
const Users_1 = require("../../db/models/Users");
const utils_1 = require("../../utils");
const sequelize_1 = require("sequelize");
const tokenService_1 = require("../../service/tokenService");
class LikeSocket {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.getLikes = (itemId) => __awaiter(this, void 0, void 0, function* () {
            this.socket.join(`item:${itemId}`);
            const likes = yield Likes_1.Likes.findAll({ where: { itemId }, include: [{ model: Users_1.Users, attributes: ['nickname'] }] });
            const flatLikes = likes.map(like => (0, utils_1.flatJoinedModel)(like, [like.users]));
            this.socket.emit('likes', flatLikes);
        });
        this.setLike = ({ token, userId, itemId, nickname }) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(0, tokenService_1.checkToken)(token, userId)) {
                    return this.socket.emit('token_error');
                }
                const like = yield Likes_1.Likes.create({ userId, itemId }, { ignoreDuplicates: true, });
                this.io.to(`item:${itemId}`).emit('like', Object.assign(Object.assign({}, like.dataValues), { nickname }));
            }
            catch (e) {
                if (e instanceof sequelize_1.EmptyResultError) {
                    yield Likes_1.Likes.destroy({ where: { userId, itemId } });
                    this.io.to(`item:${itemId}`).emit('cancel_like', userId);
                }
            }
        });
    }
    onEvents() {
        this.socket.on('get:likes', this.getLikes);
        this.socket.on('set:like', this.setLike);
    }
}
exports.LikeSocket = LikeSocket;
