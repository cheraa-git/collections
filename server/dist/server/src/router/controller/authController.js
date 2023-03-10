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
const Users_1 = require("../../db/models/Users");
const authService_1 = require("../../service/authService");
const AuthError_1 = require("../../../../common/errors/AuthError");
const AutoLoginError_1 = require("../../../../common/errors/AutoLoginError");
const tokenService_1 = require("../../service/tokenService");
const emailService_1 = require("../../service/emailService");
const DbError_1 = require("../../../../common/errors/DbError");
class AuthController {
    constructor() {
        this.handleRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            (0, tokenService_1.parseRegisterToken)(token)
                .mapRight(({ email, password, nickname }) => __awaiter(this, void 0, void 0, function* () {
                const response = yield (0, authService_1.registerUser)(nickname || '', email, password);
                response
                    .mapRight(user => res.json(user))
                    .mapLeft(e => res.status(401).json(e));
            }));
        });
        this.handleLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const email = (_a = req.body.email) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            const password = (_b = req.body.password) === null || _b === void 0 ? void 0 : _b.trim();
            if (!email || !password) {
                return res.status(401).json(new AuthError_1.AuthError('Registration data invalid'));
            }
            const response = yield (0, authService_1.checkLoginData)(email, password);
            response
                .mapRight(user => res.json(Object.assign(Object.assign({}, user), { token: (0, tokenService_1.createToken)(user), password: undefined })))
                .mapLeft(e => res.status(401).json(e));
        });
        this.handleAutoLogin = ({ body: { token } }, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, hashPassword, isAvailable } = (0, tokenService_1.checkAutoLoginToken)(token);
            const user = yield Users_1.Users.findOne({ where: { email } });
            if (!user || user.password !== hashPassword || !isAvailable) {
                return res.status(500).json(new AutoLoginError_1.AutoLoginError());
            }
            res.json(Object.assign(Object.assign({}, user.dataValues), { token, password: undefined }));
        });
        this.handleSendConfirmEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const nickname = req.body.nickname.trim().toLowerCase();
            const email = req.body.email.trim().toLowerCase();
            const password = req.body.password.trim();
            if (!nickname || !email || !password) {
                return res.status(401).json(new AuthError_1.AuthError('Registration data invalid'));
            }
            const checkRegisterDataResponse = yield (0, authService_1.checkRegisterData)(email, nickname);
            checkRegisterDataResponse
                .mapLeft(e => res.status(401).json(e))
                .mapRight(() => __awaiter(this, void 0, void 0, function* () {
                (yield (0, emailService_1.sendRegisterConfirm)({ email, nickname, password }))
                    .mapRight(() => res.json({ status: 200 }))
                    .mapLeft(e => res.status(401).json(new DbError_1.DbError('sendRegisterConfirm: Error', e)));
            }));
        });
        this.handleAuthByProvider = (req, res) => __awaiter(this, void 0, void 0, function* () {
            (yield (0, authService_1.authByProvider)(req.body))
                .mapRight(user => res.json(user))
                .mapLeft(e => res.status(401).json(e));
        });
    }
}
exports.default = AuthController;
