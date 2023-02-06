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
exports.ItemsTags = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Items_1 = require("./Items");
const Tags_1 = require("./Tags");
let ItemsTags = class ItemsTags extends sequelize_typescript_1.Model {
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
], ItemsTags.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Items_1.Items),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemsTags.prototype, "itemId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Tags_1.Tags),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemsTags.prototype, "tagId", void 0);
ItemsTags = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: false, tableName: 'items_tags' })
], ItemsTags);
exports.ItemsTags = ItemsTags;
