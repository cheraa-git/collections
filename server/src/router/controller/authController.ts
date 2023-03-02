import { Request, Response } from "express"
import { Users } from "../../db/models/Users"
import { checkLoginData, registerUser } from "../../service/authService"
import { AuthorizationError } from "../../../../common/errors/AuthorizationError"
import { AutoLoginError } from "../../../../common/errors/AutoLoginError"
import { checkAutoLoginToken, createToken } from "../../service/tokenService"


class AuthController {

  handleRegisterUser = async (req: Request, res: Response) => {
    const nickname = req.body.nickname.trim().toLowerCase()
    const email = req.body.email.trim().toLowerCase()
    const avatarUrl = req.body.avatarUrl
    const password = req.body.password.trim()
    if (!nickname || !email || !password) {
      return res.status(401).json(new AuthorizationError('Registration data invalid'))
    }
    const response = await registerUser(nickname, email, password, avatarUrl)
    response
      .mapRight(user => res.json(user))
      .mapLeft(e => res.status(401).json(e))
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

}

export default AuthController


