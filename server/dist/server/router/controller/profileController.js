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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const profileService_1 = require("../../service/profileService");
const authService_1 = require("../../service/authService");
const emailService_1 = require("../../service/emailService");
const tokenService_1 = require("../../service/tokenService");
const TokenError_1 = require("../../../common/errors/TokenError");
class ProfileController {
    handleGetProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = +req.params.userId;
            const response = yield (0, profileService_1.getProfile)(userId);
            response
                .mapRight(profile => res.json(profile))
                .mapLeft(e => res.status(500).json(e));
        });
    }
    handleSendConfirmationEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { oldEmail, oldPassword } = _a, newUserData = __rest(_a, ["oldEmail", "oldPassword"]);
            const authResponse = yield (0, authService_1.checkLoginData)(oldEmail, oldPassword);
            authResponse
                .mapLeft(e => res.status(401).json(e))
                .mapRight(() => __awaiter(this, void 0, void 0, function* () {
                (yield (0, emailService_1.sendConfirmProfileChange)(Object.assign(Object.assign({}, newUserData), { oldEmail })))
                    .mapLeft(e => res.status(500).json(e));
            }));
        });
    }
    handleEditProfile({ body: { token } }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield (0, profileService_1.editProfile)(token))
                .mapRight(userId => res.json(userId))
                .mapLeft(e => res.status(500).json(e));
        });
    }
    handleEditAvatar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, userId, avatarUrl } = req.body;
            if (!(0, tokenService_1.checkToken)(token, userId))
                return res.status(498).json(new TokenError_1.TokenError());
            const response = yield (0, profileService_1.editAvatar)(userId, avatarUrl);
            response
                .mapRight(r => res.json(r))
                .mapLeft(e => res.status(500).json(e));
        });
    }
}
exports.ProfileController = ProfileController;
