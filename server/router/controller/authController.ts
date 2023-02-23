import { Request, Response } from "express"
import * as bcrypt from "bcrypt"
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { Users } from "../../db/models/Users"


const SECRET_KEY = process.env.TOKEN_SECTET_KEY + ''

class AuthController {

  private async checkLoginData(email: string, password: string) {
    const user = await Users.findOne({ where: { email } })
    if (!user) return { error: 'No user with this email was found' }
    if (user.status !== 'active') return { error: `StatusError: ${user.status}` }
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
      const newUserData = { nickname, email, password: hashPassword, avatarUrl, isAdmin: false, status: 'active' }
      const newUser = await Users.create(newUserData)
      const token = jwt.sign({ email, hashPassword, id: newUser.id, isAdmin: false, status: 'active' }, SECRET_KEY)
      res.json({ ...newUser.dataValues, password: undefined, token })
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
    const { error, data: user } = await this.checkLoginData(email, password)
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


