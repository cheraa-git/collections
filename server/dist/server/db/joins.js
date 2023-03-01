"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullItemJoin = void 0;
const Collections_1 = require("./models/Collections");
const Users_1 = require("./models/Users");
const Tags_1 = require("./models/Tags");
const getFullItemJoin = () => [
    {
        model: Collections_1.Collections,
        as: 'collection',
        include: [{ model: Users_1.Users }]
    },
    {
        model: Tags_1.Tags,
        through: { attributes: [] }
    }
];
exports.getFullItemJoin = getFullItemJoin;
