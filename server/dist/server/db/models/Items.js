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
exports.Items = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Collections_1 = require("./Collections");
const Tags_1 = require("./Tags");
const ItemsTags_1 = require("./ItemsTags");
const Comments_1 = require("./Comments");
const Likes_1 = require("./Likes");
const searchService_1 = require("../../service/searchService");
let Items = class Items extends sequelize_typescript_1.Model {
    static afterCreateHook(instance) {
        (0, searchService_1.addItemIndex)(instance);
    }
    static afterBulkUpdateHook(options) {
        (0, searchService_1.uploadItemIndex)(options.attributes);
    }
    static afterBulkDestroyHook(options) {
        (0, searchService_1.removeItemIndex)(options.where.id);
    }
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
], Items.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Collections_1.Collections),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Items.prototype, "collectionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Items.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Items.prototype, "timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Items.prototype, "str1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Items.prototype, "str2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Items.prototype, "str3", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], Items.prototype, "txt1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], Items.prototype, "txt2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], Items.prototype, "txt3", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL }),
    __metadata("design:type", Number)
], Items.prototype, "numb1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL }),
    __metadata("design:type", Number)
], Items.prototype, "numb2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL }),
    __metadata("design:type", Number)
], Items.prototype, "numb3", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], Items.prototype, "bool1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], Items.prototype, "bool2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], Items.prototype, "bool3", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", String)
], Items.prototype, "date1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", String)
], Items.prototype, "date2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", String)
], Items.prototype, "date3", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Collections_1.Collections),
    __metadata("design:type", Collections_1.Collections)
], Items.prototype, "collections", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Tags_1.Tags, () => ItemsTags_1.ItemsTags),
    __metadata("design:type", Array)
], Items.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Comments_1.Comments, { onDelete: 'cascade' }),
    __metadata("design:type", Array)
], Items.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Likes_1.Likes, { onDelete: 'cascade' }),
    __metadata("design:type", Array)
], Items.prototype, "likes", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Items]),
    __metadata("design:returntype", void 0)
], Items, "afterCreateHook", null);
__decorate([
    sequelize_typescript_1.AfterBulkUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Items, "afterBulkUpdateHook", null);
__decorate([
    sequelize_typescript_1.AfterBulkDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Items, "afterBulkDestroyHook", null);
Items = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: false, tableName: 'items' })
], Items);
exports.Items = Items;
