"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatJoinedModel = exports.filterItem = void 0;
const filterItem = (item) => {
    if (!item)
        return {};
    const filterItem = {};
    Object.entries((item === null || item === void 0 ? void 0 : item.dataValues) || item).forEach(([key, value]) => {
        if (value) {
            filterItem[key] = value;
        }
    });
    return filterItem;
};
exports.filterItem = filterItem;
const flatJoinedModel = (obj, from) => {
    let flatObj = {};
    Object.entries(obj === null || obj === void 0 ? void 0 : obj.dataValues).forEach(([key, value]) => {
        if (typeof value !== "object") {
            flatObj[key] = value;
        }
    });
    const joinedValues = from.reduce((acc, model) => (Object.assign(Object.assign({}, acc), model === null || model === void 0 ? void 0 : model.dataValues)), {});
    return Object.assign(Object.assign({}, flatObj), joinedValues);
};
exports.flatJoinedModel = flatJoinedModel;
