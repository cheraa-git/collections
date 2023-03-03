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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRegisterConfirm = exports.sendProfileChangeConfirm = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const either_1 = require("@sweet-monads/either");
const GmailError_1 = require("../../../common/errors/GmailError");
const tokenService_1 = require("./tokenService");
const sendEmail = ({ to, text, subject }) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: { user: process.env.VERIFY_GMAIL_LOGIN, pass: process.env.VERIFY_GMAIL_PASSWORD }
    });
    const mailOptions = { from: process.env.VERIFY_GMAIL_LOGIN, to, subject, text };
    return yield transporter.sendMail(mailOptions);
});
const sendProfileChangeConfirm = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, tokenService_1.createEditProfileToken)(data);
        const url = `${process.env.CLIENT_URL}/confirmation/edit/${token}`;
        return (0, either_1.right)(yield sendEmail({
            to: data.adminEmail || data.oldEmail,
            subject: 'Follow the link to change your account details',
            text: url
        }));
    }
    catch (e) {
        console.log(e);
        return (0, either_1.left)(new GmailError_1.GmailError('sendConfirmProfileChange Error', e));
    }
});
exports.sendProfileChangeConfirm = sendProfileChangeConfirm;
const sendRegisterConfirm = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, tokenService_1.createRegisterToken)(data);
        const url = `${process.env.CLIENT_URL}/confirmation/register/${token}`;
        return (0, either_1.right)(yield sendEmail({
            to: data.email,
            subject: 'Follow the link to create an account',
            text: url
        }));
    }
    catch (e) {
        console.log(e);
        return (0, either_1.left)(new GmailError_1.GmailError('sendConfirmProfileChange Error', e));
    }
});
exports.sendRegisterConfirm = sendRegisterConfirm;
