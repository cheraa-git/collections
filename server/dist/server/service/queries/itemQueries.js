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
exports.getItemWithTagsQuery = exports.getRangeItemsQuery = void 0;
const Items_1 = require("../../db/models/Items");
const Tags_1 = require("../../db/models/Tags");
const sequelize_typescript_1 = require("sequelize-typescript");
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
