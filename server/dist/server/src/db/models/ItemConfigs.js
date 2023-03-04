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
exports.ItemConfigs = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Collections_1 = require("./Collections");
let ItemConfigs = class ItemConfigs extends sequelize_typescript_1.Model {
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
], ItemConfigs.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Collections_1.Collections),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemConfigs.prototype, "collectionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], ItemConfigs.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], ItemConfigs.prototype, "label", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], ItemConfigs.prototype, "hidden", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Collections_1.Collections),
    __metadata("design:type", Collections_1.Collections)
], ItemConfigs.prototype, "collections", void 0);
ItemConfigs = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: false, tableName: 'item_configs' })
], ItemConfigs);
exports.ItemConfigs = ItemConfigs;
