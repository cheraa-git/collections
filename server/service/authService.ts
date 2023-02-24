import * as bcrypt from "bcrypt"
import { Users } from "../db/models/Users"
import * as jwt from "jsonwebtoken"


const SECRET_KEY = process.env.TOKEN_SECTET_KEY + ''

export const registerUser = async (nickname: string, email: string, avatarUrl: string, password: string) => {
  const hashPassword = await bcrypt.hash(password, 10)
  const newUserData = { nickname, email, password: hashPassword, avatarUrl, isAdmin: false, status: 'active' }
  const newUser = await Users.create(newUserData)
  const token = jwt.sign({ email, hashPassword, id: newUser.id, isAdmin: false, status: 'active' }, SECRET_KEY)
  return { ...newUser.dataValues, password: undefined, token }
}

export const checkLoginData = async (email: string, password: string) => {
  const user = await Users.findOne({ where: { email } })
  if (!user) return { error: 'No user with this email was found' }
  if (user.status !== 'active') return { error: `StatusError: ${user.status}` }
  const comparePassword = await bcrypt.compare(password, user.password)
  if (!comparePassword) return { error: 'The password is invalid', }
  return { error: '', data: user.dataValues }
}



