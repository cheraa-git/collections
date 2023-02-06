import { Request, Response } from "express"
import * as bcrypt from "bcrypt"
import * as jwt from 'jsonwebtoken'
import { Users } from "../db/models/Users"
import { JwtPayload } from "jsonwebtoken"


const SECRET_KEY = process.env.TOKEN_SECTET_KEY + ''
class AuthController {

  private async checkLoginData(email: string, password: string) {
    const user = await Users.findOne({ where: { email } })
    if (!user) return { error: 'No user with this email was found' }
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) return { error: 'The password is invalid', }
    return { error: '', data: user.dataValues }
  }

  registerUser = async (req: Request, res: Response) => {
    const nickname = req.body.nickname.trim().toLowerCase()
    const email = req.body.email.trim().toLowerCase()
    const avatarUrl = req.body.avatarUrl
    const password = req.body.password.trim()
    const hashPassword = await bcrypt.hash(password, 10)
    if (!nickname || !email || !password) {
      return res.status(500).json({ error: 'Registration data invalid' })
    }
    try {
      const newUser = await Users.create({ nickname, email, password: hashPassword, avatarUrl })
      const token = jwt.sign({ email, hashPassword, id: newUser.id }, SECRET_KEY)
      res.json({ ...newUser.dataValues, password: undefined, token })
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(500).json({ error: `${error.errors[0].path} already exists` })
      } else console.log(error)
    }
  }

  loginUser = async (req: Request, res: Response) => {
    const reqEmail = req.body.email?.trim().toLowerCase()
    const reqPassword = req.body.password?.trim()
    if (!reqEmail || !reqPassword) {
      return res.status(500).json({ error: 'Registration data invalid' })
    }
    const user = await this.checkLoginData(reqEmail, reqPassword)
    if (user.error) return res.status(500).json({ error: user.error })
    const token = jwt.sign({ email: reqEmail, hashPassword: user.data?.password, id: user.data?.id }, SECRET_KEY)
    res.json({ ...user.data, token, password: undefined })
  }

  autoLogin = async (req: Request, res: Response) => {
    const token = req.body.token
    const jwtPayload = jwt.verify(token, SECRET_KEY) as JwtPayload
    const iat = jwtPayload.iat as number
    const isExpired = ((iat + 3600) * 1000) < Date.now()
    const user = await Users.findOne({ where: { email: jwtPayload.email } })
    if (!user || user.password !== jwtPayload.hashPassword || isExpired) {
      return res.status(500).json({ error: 'Autologin canceled' })
    }
    res.json({ ...user.dataValues, token, password: undefined })
  }

}

export default AuthController


