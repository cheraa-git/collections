import nodemailer from 'nodemailer'
import { Either, left, right } from "@sweet-monads/either"
import { GmailError } from "../../../common/errors/GmailError"
import { createEditProfileToken } from "./tokenService"
import { EditProfileTokenData } from "../../../common/common-types"


export const sendConfirmProfileChange = async (data: EditProfileTokenData): Promise<Either<GmailError, any>> => {
  try {
    const token = await createEditProfileToken(data)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.VERIFY_GMAIL_LOGIN, pass: process.env.VERIFY_GMAIL_PASSWORD }
    })
    const mailOptions = {
      from: process.env.VERIFY_GMAIL_LOGIN,
      to: data.adminEmail || data.oldEmail,
      subject: 'Follow the link to change your account details',
      text: `${process.env.CLIENT_URL}/confirmation/edit/${token}`
    }
    return right( await transporter.sendMail(mailOptions))
  } catch (e) {
    console.log(e)
    return left(new GmailError('sendConfirmProfileChange Error', e))
  }
}
