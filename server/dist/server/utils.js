"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterItem = void 0;
const filterItem = (item) => {
    const filterItem = {};
    Object.entries(item === null || item === void 0 ? void 0 : item.dataValues).forEach(([key, value]) => {
        if (value) {
            filterItem[key] = value;
        }
    });
    return filterItem;
};
exports.filterItem = filterItem;
