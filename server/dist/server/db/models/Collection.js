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
exports.Collections = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Users_1 = require("./Users");
const Items_1 = require("./Items");
const ItemConfigs_1 = require("./ItemConfigs");
const Themes_1 = require("./Themes");
const searchService_1 = require("../../service/searchService");
let Collections = class Collections extends sequelize_typescript_1.Model {
    static afterCreateHook(instance) {
        (0, searchService_1.addCollectionIndex)(instance);
    }
    static afterBulkUpdateHook(options) {
        (0, searchService_1.uploadCollectionIndex)(options.attributes);
    }
    static afterBulkDestroyHook(options) {
        (0, searchService_1.removeCollectionIndex)(options.where.id);
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
], Collections.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Collections.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Collections.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], Collections.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Themes_1.Themes),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Collections.prototype, "themeId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Collections.prototype, "imageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Collections.prototype, "timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Themes_1.Themes),
    __metadata("design:type", Themes_1.Themes)
], Collections.prototype, "themes", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users),
    __metadata("design:type", Users_1.Users)
], Collections.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Items_1.Items, { onDelete: 'cascade' }),
    __metadata("design:type", Array)
], Collections.prototype, "items", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ItemConfigs_1.ItemConfigs, { onDelete: 'cascade' }),
    __metadata("design:type", Array)
], Collections.prototype, "itemConfigs", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Collections]),
    __metadata("design:returntype", void 0)
], Collections, "afterCreateHook", null);
__decorate([
    sequelize_typescript_1.AfterBulkUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Collections, "afterBulkUpdateHook", null);
__decorate([
    sequelize_typescript_1.AfterBulkDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Collections, "afterBulkDestroyHook", null);
Collections = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: false, tableName: 'collections' })
], Collections);
exports.Collections = Collections;
