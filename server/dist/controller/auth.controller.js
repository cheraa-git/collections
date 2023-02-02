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
const db_1 = require("../db");
const sql_error_codes_1 = require("../constants/sql-error-codes");
const pg_1 = require("pg");
class AuthController {
    constructor() {
        this.SECRET_KEY = process.env.PGPASSWORD + '';
    }
    checkLoginData(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield db_1.db.query('SELECT * from users where email = $1', [email])).rows[0];
            if (!user)
                return { error: 'No user with this email was found' };
            const comparePassword = yield bcrypt.compare(password, user.password);
            if (!comparePassword)
                return { error: 'The password is invalid', };
            return { error: '', data: user };
        });
    }
    registerUser(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const nickname = req.body.nickname.trim().toLowerCase();
            const email = req.body.email.trim().toLowerCase();
            const avatarUrl = req.body.avatarUrl;
            const password = req.body.password.trim();
            const hashPassword = yield bcrypt.hash(password, 10);
            if (!nickname || !email || !password) {
                return res.status(500).json({ error: 'Registration data invalid' });
            }
            try {
                const newUser = yield db_1.db.query(`
                  INSERT INTO users (nickname, email, avatar, password)
                  values ($1, $2, $3, $4)
                  RETURNING id, nickname, email, avatar
                  `, [nickname, email, avatarUrl, hashPassword]);
                const token = jwt.sign({ email, hashPassword }, this.SECRET_KEY);
                res.json(Object.assign(Object.assign({}, newUser.rows[0]), { token }));
            }
            catch (error) {
                if (error instanceof pg_1.DatabaseError && error.code === sql_error_codes_1.DUPLICATE_UNIQUE_VALES) {
                    const column = (_a = error.constraint) === null || _a === void 0 ? void 0 : _a.split('_')[1];
                    res.status(500).json({ error: `${column} already exists` });
                }
                else
                    console.log(error);
            }
        });
    }
    loginUser(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const reqEmail = (_a = req.body.email) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            const reqPassword = (_b = req.body.password) === null || _b === void 0 ? void 0 : _b.trim();
            if (!reqEmail || !reqPassword) {
                return res.status(500).json({ error: 'Registration data invalid' });
            }
            const user = yield this.checkLoginData(reqEmail, reqPassword);
            if (user.error)
                return res.status(500).json({ error: user.error });
            const token = jwt.sign({ email: reqEmail, hashPassword: user.data.password }, this.SECRET_KEY);
            const { id, nickname, email, avatar } = user.data;
            res.json({ id, nickname, email, avatar, token });
        });
    }
}
exports.default = new AuthController();
