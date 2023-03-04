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
exports.createTagsQuery = exports.getMostPopularTagsQuery = exports.getItemWithTagsQuery = exports.getRangeItemsQuery = void 0;
const Items_1 = require("../../db/models/Items");
const Tags_1 = require("../../db/models/Tags");
const sequelize_typescript_1 = require("sequelize-typescript");
const ItemsTags_1 = require("../../db/models/ItemsTags");
const Collections_1 = require("../../db/models/Collections");
const getRangeItemsQuery = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Items_1.Items.findAll({
        offset: params.offset,
        limit: params.limit,
        include: [
            {
                model: Tags_1.Tags,
                through: { attributes: [] },
                where: (params.tagIds && params.tagIds.length > 0) ? { id: params.tagIds } : undefined,
            },
            {
                model: Collections_1.Collections,
                attributes: ['title']
            }
        ],
        order: [sequelize_typescript_1.Sequelize.literal('timestamp DESC')]
    });
});
exports.getRangeItemsQuery = getRangeItemsQuery;
const getItemWithTagsQuery = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Items_1.Items.findOne({
        where: { id: params.itemId },
        include: {
            model: Tags_1.Tags,
            through: { attributes: [] }
        }
    });
});
exports.getItemWithTagsQuery = getItemWithTagsQuery;
const getMostPopularTagsQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    return ItemsTags_1.ItemsTags.findAll({
        limit: 30,
        attributes: [
            'tagId',
            [sequelize_typescript_1.Sequelize.fn('count', sequelize_typescript_1.Sequelize.col('tagId')), 'count'],
        ],
        group: ['ItemsTags.tagId'],
        order: sequelize_typescript_1.Sequelize.literal('count DESC')
    });
});
exports.getMostPopularTagsQuery = getMostPopularTagsQuery;
const createTagsQuery = (tags) => __awaiter(void 0, void 0, void 0, function* () {
    if (tags.length === 0)
        return [];
    try {
        return yield Tags_1.Tags.bulkCreate(tags);
    }
    catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.name) === 'SequelizeUniqueConstraintError') {
            const existTags = yield Tags_1.Tags.findAll({ where: { name: tags.map(tag => tag.name) } });
            const uniqueTags = tags.filter(tag => !existTags.find(existTag => existTag.name === tag.name));
            const createdTags = yield Tags_1.Tags.bulkCreate(uniqueTags);
            return [...createdTags, ...existTags];
        }
        return [];
    }
});
exports.createTagsQuery = createTagsQuery;
