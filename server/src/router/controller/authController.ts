import { Request, Response } from "express"
import { Users } from "../../db/models/Users"
import { checkLoginData, checkRegisterData, registerUser } from "../../service/authService"
import { AuthorizationError } from "../../../../common/errors/AuthorizationError"
import { AutoLoginError } from "../../../../common/errors/AutoLoginError"
import { checkAutoLoginToken, createToken, parseRegisterToken } from "../../service/tokenService"
import { sendRegisterConfirm } from "../../service/emailService"
import { DatabaseError } from "../../../../common/errors/DatabaseError"


class AuthController {

  handleRegisterUser = async (req: Request, res: Response) => {
    const token = req.body.token
    parseRegisterToken(token)
      .mapRight(async ({ email, password, nickname }) => {
        const response = await registerUser(nickname || '', email, password)
        response
          .mapRight(user => res.json(user))
          .mapLeft(e => res.status(401).json(e))
      })
  }

  handleLoginUser = async (req: Request, res: Response) => {
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password?.trim()
    if (!email || !password) {
      return res.status(401).json(new AuthorizationError('Registration data invalid'))
    }
    const response = await checkLoginData(email, password)
    response
      .mapRight(user => res.json({ ...user, token: createToken(user), password: undefined }))
      .mapLeft(e => res.status(401).json(e))
  }

  handleAutoLogin = async ({ body: { token } }: Request, res: Response) => {
    const { email, hashPassword, isAvailable } = checkAutoLoginToken(token)
    const user = await Users.findOne({ where: { email } })
    if (!user || user.password !== hashPassword || !isAvailable) {
      return res.status(500).json(new AutoLoginError())
    }
    res.json({ ...user.dataValues, token, password: undefined })
  }

  handleSendConfirmationEmail = async (req: Request, res: Response) => {
    const nickname = req.body.nickname.trim().toLowerCase()
    const email = req.body.email.trim().toLowerCase()
    const password = req.body.password.trim()
    if (!nickname || !email || !password) {
      return res.status(401).json(new AuthorizationError('Registration data invalid'))
    }
    const checkRegisterDataResponse = await checkRegisterData(email, nickname)
    checkRegisterDataResponse
      .mapLeft(e => res.status(401).json(e))
      .mapRight(async () => {
        (await sendRegisterConfirm({ email, nickname, password }))
          .mapRight(() => res.json({status: 200}))
          .mapLeft(e => res.status(401).json(new DatabaseError('sendRegisterConfirm: Error', e)))
      })
  }
}

export default AuthController


