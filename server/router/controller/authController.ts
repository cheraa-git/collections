import { Request, Response } from "express"
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { Users } from "../../db/models/Users"
import { checkLoginData, registerUser } from "../../service/authService"


const SECRET_KEY = process.env.TOKEN_SECTET_KEY + ''

class AuthController {

  handleRegisterUser = async (req: Request, res: Response) => {
    const nickname = req.body.nickname.trim().toLowerCase()
    const email = req.body.email.trim().toLowerCase()
    const avatarUrl = req.body.avatarUrl
    const password = req.body.password.trim()
    if (!nickname || !email || !password) {
      return res.status(500).json({ error: 'Registration data invalid' })
    }
    try {
      res.json(await registerUser(nickname, email, avatarUrl, password))
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(500).json({ error: `${error.errors[0].path} already exists` })
      } else console.log(error)
    }
  }

  loginUser = async (req: Request, res: Response) => {
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password?.trim()
    if (!email || !password) {
      return res.status(500).json({ error: 'Registration data invalid' })
    }
    const { error, data: user } = await checkLoginData(email, password)
    if (error) return res.status(500).json({ error })
    const token = jwt.sign(
      { email, hashPassword: user?.password, id: user?.id, isAdmin: user?.isAdmin, status: user?.status },
      SECRET_KEY
    )
    res.json({ ...user, token, password: undefined })
  }

  autoLogin = async (req: Request, res: Response) => {
    const token = req.body.token
    const jwtPayload = jwt.verify(token, SECRET_KEY) as JwtPayload
    const iat = jwtPayload.iat as number
    const isExpired = (((iat + 3600) * 24) * 1000) < Date.now()
    const statusIsAvailable = jwtPayload.status === 'active'
    const user = await Users.findOne({ where: { email: jwtPayload.email } })
    if (!user || user.password !== jwtPayload.hashPassword || isExpired || !statusIsAvailable) {
      return res.status(500).json({ error: 'Autologin canceled' })
    }
    res.json({ ...user.dataValues, token, password: undefined })
  }

}

export default AuthController


