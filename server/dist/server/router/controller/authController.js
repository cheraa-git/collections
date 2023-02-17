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
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const Users_1 = require("../../db/models/Users");
const SECRET_KEY = process.env.TOKEN_SECTET_KEY + '';
class AuthController {
    constructor() {
        this.registerUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const nickname = req.body.nickname.trim().toLowerCase();
            const email = req.body.email.trim().toLowerCase();
            const avatarUrl = req.body.avatarUrl;
            const password = req.body.password.trim();
            const hashPassword = yield bcrypt.hash(password, 10);
            if (!nickname || !email || !password) {
                return res.status(500).json({ error: 'Registration data invalid' });
            }
            try {
                const newUser = yield Users_1.Users.create({ nickname, email, password: hashPassword, avatarUrl });
                const token = jwt.sign({ email, hashPassword, id: newUser.id }, SECRET_KEY);
                res.json(Object.assign(Object.assign({}, newUser.dataValues), { password: undefined, token }));
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
            var _a, _b, _c, _d;
            const reqEmail = (_a = req.body.email) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            const reqPassword = (_b = req.body.password) === null || _b === void 0 ? void 0 : _b.trim();
            if (!reqEmail || !reqPassword) {
                return res.status(500).json({ error: 'Registration data invalid' });
            }
            const user = yield this.checkLoginData(reqEmail, reqPassword);
            if (user.error)
                return res.status(500).json({ error: user.error });
            const token = jwt.sign({ email: reqEmail, hashPassword: (_c = user.data) === null || _c === void 0 ? void 0 : _c.password, id: (_d = user.data) === null || _d === void 0 ? void 0 : _d.id }, SECRET_KEY);
            res.json(Object.assign(Object.assign({}, user.data), { token, password: undefined }));
        });
        this.autoLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.body.token;
            const jwtPayload = jwt.verify(token, SECRET_KEY);
            const iat = jwtPayload.iat;
            const isExpired = (((iat + 3600) * 24) * 1000) < Date.now(); // TODO: убрать 24 (чтобы срок действия токена был 1 час
            const user = yield Users_1.Users.findOne({ where: { email: jwtPayload.email } });
            if (!user || user.password !== jwtPayload.hashPassword || isExpired) {
                return res.status(500).json({ error: 'Autologin canceled' });
            }
            res.json(Object.assign(Object.assign({}, user.dataValues), { token, password: undefined }));
        });
    }
    checkLoginData(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users_1.Users.findOne({ where: { email } });
            if (!user)
                return { error: 'No user with this email was found' };
            const comparePassword = yield bcrypt.compare(password, user.password);
            if (!comparePassword)
                return { error: 'The password is invalid', };
            return { error: '', data: user.dataValues };
        });
    }
}
exports.default = AuthController;
