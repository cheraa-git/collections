"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jwt = __importStar(require("jsonwebtoken"));
const Users_1 = require("../../db/models/Users");
const authService_1 = require("../../service/authService");
const SECRET_KEY = process.env.TOKEN_SECTET_KEY + '';
class AuthController {
    constructor() {
        this.handleRegisterUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const nickname = req.body.nickname.trim().toLowerCase();
            const email = req.body.email.trim().toLowerCase();
            const avatarUrl = req.body.avatarUrl;
            const password = req.body.password.trim();
            if (!nickname || !email || !password) {
                return res.status(500).json({ error: 'Registration data invalid' });
            }
            try {
                res.json(yield (0, authService_1.registerUser)(nickname, email, avatarUrl, password));
            }
            catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    res.status(500).json({ error: `${error.errors[0].path} already exists` });
                }
                else
                    console.log(error);
            }
        });
        this.loginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const email = (_a = req.body.email) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            const password = (_b = req.body.password) === null || _b === void 0 ? void 0 : _b.trim();
            if (!email || !password) {
                return res.status(500).json({ error: 'Registration data invalid' });
            }
            const { error, data: user } = yield (0, authService_1.checkLoginData)(email, password);
            if (error)
                return res.status(500).json({ error });
            const token = jwt.sign({ email, hashPassword: user === null || user === void 0 ? void 0 : user.password, id: user === null || user === void 0 ? void 0 : user.id, isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin, status: user === null || user === void 0 ? void 0 : user.status }, SECRET_KEY);
            res.json(Object.assign(Object.assign({}, user), { token, password: undefined }));
        });
        this.autoLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            const user = yield Users_1.Users.findOne({ where: { email: jwtPayload.email } });
            if (!user || !(0, authService_1.validateToken)(token, user.password)) {
                return res.status(500).json({ error: 'Autologin canceled' });
            }
            res.json(Object.assign(Object.assign({}, user.dataValues), { token, password: undefined }));
        });
    }
}
exports.default = AuthController;
