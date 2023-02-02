import { Request, Response } from "express"
import * as bcrypt from "bcrypt"
import * as jwt from 'jsonwebtoken'
import { db } from "../db"
import { DUPLICATE_UNIQUE_VALES } from "../constants/sql-error-codes"
import { DatabaseError } from "pg"


class AuthController {
  private SECRET_KEY = process.env.PGPASSWORD + ''

  private async checkLoginData(email: string, password: string) {
    const user = (await db.query('SELECT * from users where email = $1', [email])).rows[0]
    if (!user) return { error: 'No user with this email was found' }
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) return { error: 'The password is invalid', }
    return { error: '', data: user }
  }

  async registerUser(req: Request, res: Response) {
    const nickname = req.body.nickname.trim().toLowerCase()
    const email = req.body.email.trim().toLowerCase()
    const avatarUrl = req.body.avatarUrl
    const password = req.body.password.trim()
    const hashPassword = await bcrypt.hash(password, 10)
    if (!nickname || !email || !password) {
      return res.status(500).json({ error: 'Registration data invalid' })
    }
    try {
      const newUser = await db.query(`
                  INSERT INTO users (nickname, email, avatar, password)
                  values ($1, $2, $3, $4)
                  RETURNING id, nickname, email, avatar
                  `, [nickname, email, avatarUrl, hashPassword])
      const token = jwt.sign({ email, hashPassword }, this.SECRET_KEY)
      res.json({ ...newUser.rows[0], token })
    } catch (error) {
      if (error instanceof DatabaseError && error.code === DUPLICATE_UNIQUE_VALES) {
        const column = error.constraint?.split('_')[1]
        res.status(500).json({ error: `${column} already exists` })
      } else console.log(error)
    }
  }

  async loginUser(req: Request, res: Response) {
    const reqEmail = req.body.email?.trim().toLowerCase()
    const reqPassword = req.body.password?.trim()
    if (!reqEmail || !reqPassword) {
      return res.status(500).json({ error: 'Registration data invalid' })
    }
    const user = await this.checkLoginData(reqEmail, reqPassword)
    if (user.error) return res.status(500).json({ error: user.error })
    const token = jwt.sign({ email: reqEmail, hashPassword: user.data.password }, this.SECRET_KEY)
    const { id, nickname, email, avatar } = user.data
    res.json({ id, nickname, email, avatar, token })
  }

}

export default new AuthController()
