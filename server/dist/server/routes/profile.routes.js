'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const express_1 = require("express");
const profileController_1 = require("../controller/profileController");
const controller = new profileController_1.ProfileController();
exports.profileRouter = (0, express_1.Router)();
exports.profileRouter.get('/:userId', controller.getProfile);
