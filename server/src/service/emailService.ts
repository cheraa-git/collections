import nodemailer from 'nodemailer'
import { Either, left, right } from "@sweet-monads/either"
import { GmailError } from "../../../common/errors/GmailError"
import { createEditProfileToken, createRegisterToken } from "./tokenService"
import { AuthData, EditProfileTokenData } from "../../../common/types/user"


const sendEmail = async ({ to, text, subject }: { to: string, subject: string, text: string }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.VERIFY_GMAIL_LOGIN, pass: process.env.VERIFY_GMAIL_PASSWORD }
  })
  const mailOptions = { from: process.env.VERIFY_GMAIL_LOGIN, to, subject, text }
  return await transporter.sendMail(mailOptions)
}

export const sendProfileChangeConfirm = async (data: EditProfileTokenData): Promise<Either<GmailError, any>> => {
  try {
    const token = await createEditProfileToken(data)
    const url = `${process.env.CLIENT_URL}/confirmation/edit/${token}`
    return right(await sendEmail({
      to: data.adminEmail || data.oldEmail,
      subject: 'Follow the link to change your account details',
      text: url
    }))
  } catch (e) {
    console.log(e)
    return left(new GmailError('sendConfirmProfileChange Error', e))
  }
}

export const sendRegisterConfirm = async (data: AuthData): Promise<Either<GmailError, any>> => {
  try {
    const token = createRegisterToken(data)
    const url = `${process.env.CLIENT_URL}/confirmation/register/${token}`
    return right(await sendEmail({
      to: data.email,
      subject: 'Follow the link to create an account',
      text: url
    }))
  } catch (e) {
    console.log(e)
    return left(new GmailError('sendConfirmProfileChange Error', e))
  }
}
