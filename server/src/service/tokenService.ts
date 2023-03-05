import * as jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken"
import { Users } from "../db/models/Users"
import * as bcrypt from "bcrypt"
import { Either, left, right } from "@sweet-monads/either"
import { TokenError } from "../../../common/errors/TokenError"
import { AuthData, EditProfileTokenData } from "../../../common/types/user"


const TOKEN_SECRET_KEY = String(process.env.TOKEN_SECTET_KEY)

export const checkToken = (token?: string, userId?: number): boolean => {
  if (!token || !userId) return false
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
    const isExpired = ((iat + 3600 * 24) * 1000) < Date.now()
    const statusIsAvailable = jwtPayload.status === 'active'
    const isAvailable = !isExpired && statusIsAvailable
    return { email: jwtPayload.email, hashPassword: jwtPayload.hashPassword, isAvailable }
  } catch (e) {
    return { email: '', hashPassword: '', isAvailable: false }
  }
}
export const checkAdminToken = (token?: string): boolean => {
  if (!token) return false
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
      authProvider: user.authProvider,
      id: user.id,
      isAdmin: user.isAdmin,
      status: user.status
    }
    , TOKEN_SECRET_KEY)
}

export const createEditProfileToken = async (data: EditProfileTokenData) => {
  if (data.password) data.password = await bcrypt.hash(data.password, 10)
  return jwt.sign(data, TOKEN_SECRET_KEY)
}

export const parseEditProfileToken = (token?: string): Either<TokenError, EditProfileTokenData> => {
  if (!token) return left(new TokenError('parseEditProfileToken: Token not found'))
  try {
    const payload = jwt.verify(token, TOKEN_SECRET_KEY) as JwtPayload
    return right(
      {
        email: payload?.email,
        password: payload?.password,
        nickname: payload?.nickname,
        oldEmail: payload.oldEmail,
        adminEmail: payload.adminEmail
      }
    )
  } catch (e) {
    return left(new TokenError('parseEditProfileToken: Error'))
  }
}

export const createRegisterToken = (data: AuthData) => {
  return jwt.sign(data, TOKEN_SECRET_KEY)
}

export const parseRegisterToken = (token?: string): Either<TokenError, AuthData> => {
  if (!token) return left(new TokenError('parseEditProfileToken: Token not found'))
  try {
    const payload = jwt.verify(token, TOKEN_SECRET_KEY) as JwtPayload
    return right({ email: payload?.email, password: payload?.password, nickname: payload?.nickname, }
    )
  } catch (e) {
    return left(new TokenError('parseEditProfileToken: Error'))
  }
}
