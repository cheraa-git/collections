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
exports.SearchController = void 0;
const searchService_1 = require("../../service/searchService");
class SearchController {
    constructor() {
        this.indexingItemsHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, searchService_1.indexingAllItems)();
                res.json({ status: 'success' });
            }
            catch (err) {
                console.log("IndexingItemsError:", err);
                res.status(500).json({ status: 'error' });
            }
        });
    }
}
exports.SearchController = SearchController;
