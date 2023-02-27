import dotenv from "dotenv"
import * as jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken"
import { Users } from "../db/models/Users"


const TOKEN_SECRET_KEY = String(process.env.TOKEN_SECTET_KEY)

export const checkToken = (token?: string, userId?: number): boolean => {
  if (!token || !userId) return false
  dotenv.config()
  try {
    const jwtPayload = jwt.verify(token, TOKEN_SECRET_KEY) as JwtPayload
    return (jwtPayload.id === userId || jwtPayload.isAdmin) && jwtPayload.status === 'active'
  } catch (e) {
    return false
  }
}

export const checkAutoLoginToken = (token: string): { email: string, hashPassword: string, isAvailable: boolean } => {
  try {
    const jwtPayload = jwt.verify(token, TOKEN_SECRET_KEY) as JwtPayload
    const iat = jwtPayload.iat as number
    const isExpired = (((iat + 3600) * 24) * 1000) < Date.now()
    const statusIsAvailable = jwtPayload.status === 'active'
    const isAvailable = isExpired && statusIsAvailable
    return { email: jwtPayload.email, hashPassword: jwtPayload.hashPassword, isAvailable }
  } catch (e) {
    return { email: '', hashPassword: '', isAvailable: false }
  }
}

export const checkAdminToken = (token?: string): boolean => {
  if (!token) return false
  dotenv.config()
  try {
    const jwtPayload = jwt.verify(token, TOKEN_SECRET_KEY) as JwtPayload
    return jwtPayload.isAdmin && jwtPayload.status === 'active'
  } catch (e) {
    return false
  }
}

export const createToken = (user: Users) => {
  return jwt.sign(
    {
      email: user.email,
      hashPassword: user.password,
      id: user.id,
      isAdmin: user.isAdmin,
      status: user.status
    }
    , TOKEN_SECRET_KEY)
}
