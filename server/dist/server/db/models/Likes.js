"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Likes = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Items_1 = require("./Items");
const Users_1 = require("./Users");
let Likes = class Likes extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", Number)
], Likes.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Likes.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Items_1.Items),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Likes.prototype, "itemId", void 0);
__decorate([
    (0, sequelize_typescript_1.Index)({ unique: true }),
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users),
    __metadata("design:type", Users_1.Users)
], Likes.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Items_1.Items),
    __metadata("design:type", Items_1.Items)
], Likes.prototype, "items", void 0);
Likes = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: false, tableName: 'likes', indexes: [{ unique: true, fields: ['itemId', 'userId'] }] })
], Likes);
exports.Likes = Likes;
