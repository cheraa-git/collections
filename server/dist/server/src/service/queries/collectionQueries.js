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
exports.getFullCollectionDataQuery = exports.getCollectionsByItemCountQuery = void 0;
const Items_1 = require("../../db/models/Items");
const sequelize_1 = require("sequelize");
const Collections_1 = require("../../db/models/Collections");
const Users_1 = require("../../db/models/Users");
const ItemConfigs_1 = require("../../db/models/ItemConfigs");
const Tags_1 = require("../../db/models/Tags");
const getCollectionsByItemCountQuery = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Items_1.Items.findAll({
        offset: params.offset,
        limit: params.limit,
        attributes: [[sequelize_1.Sequelize.fn('count', sequelize_1.Sequelize.col('collectionId')), 'count']],
        include: [{
                model: Collections_1.Collections,
                where: params.themeId ? { themeId: params.themeId } : undefined,
                attributes: ['title', 'description', 'themeId', 'imageUrl', 'timestamp', 'id'],
                include: [{ model: Users_1.Users, attributes: ['nickname'] }]
            }],
        group: ['Items.collectionId', 'collections.id', 'collections.users.id'],
        order: sequelize_1.Sequelize.literal('count DESC'),
    });
});
exports.getCollectionsByItemCountQuery = getCollectionsByItemCountQuery;
const getFullCollectionDataQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Collections_1.Collections.findOne({
        where: { id },
        include: [
            { model: ItemConfigs_1.ItemConfigs },
            { model: Users_1.Users },
            { model: Items_1.Items, include: [{ model: Tags_1.Tags, through: { attributes: [] } }] }
        ],
    });
});
exports.getFullCollectionDataQuery = getFullCollectionDataQuery;
