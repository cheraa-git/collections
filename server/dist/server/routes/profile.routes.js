'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const express_1 = require("express");
const profile_contrloller_1 = require("../controller/profile.contrloller");
const controller = new profile_contrloller_1.ProfileController();
exports.profileRouter = (0, express_1.Router)();
exports.profileRouter.get('/:userId', controller.getProfile);
