import * as bcrypt from "bcrypt"
import { Users } from "../db/models/Users"
import { Either, left, right } from "@sweet-monads/either"
import { AuthError } from "../../../common/errors/AuthError"
import { DbError } from "../../../common/errors/DbError"
import { createToken } from "./tokenService"
import { User } from "../../../common/types/user"
import { AuthByProviderBody } from "../../../common/types/request-body-types/auth-body"


interface RegisterUser {
  (nickname: string, email: string, password: string): Promise<Either<AuthError | DbError, User>>
}

export const registerUser: RegisterUser = async (nickname, email, password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10)
    const newUserData = { nickname, email, password: hashPassword, isAdmin: false, status: 'active' }
    const newUser = await Users.create(newUserData)
    const token = createToken(newUser)
    return right({ ...newUser.dataValues, password: undefined, token })
  } catch (e: any) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return left(new AuthError(`${e.errors[0].path} already exists`))
    } else return left(new DbError('Register user error', e))
  }
}

interface CheckRegisterData {
  (email: string, nickname: string): Promise<Either<AuthError | DbError, any>>
}

export const checkRegisterData: CheckRegisterData = async (email, nickname) => {
  try {
    const emailMach = await Users.findOne({ where: { email } })
    const nicknameMach = await Users.findOne({ where: { nickname } })
    if (emailMach) return left(new AuthError(`email already exists`))
    if (nicknameMach) return left(new AuthError(`nickname already exists`))
    return right('')
  } catch (e) {
    return left(new DbError('checkRegisterData: Error', e))
  }
}

interface CheckLoginData {
  (email: string, password: string): Promise<Either<AuthError | DbError, Users>>
}

export const checkLoginData: CheckLoginData = async (email, password) => {
  try {
    const user = await Users.findOne({ where: { email } })
    if (!user) return left(new AuthError('No user with this email was found'))
    if (user.status !== 'active') return left(new AuthError(`The user is ${user.status}`))
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) return left(new AuthError('The password is invalid'))
    return right(user.dataValues)
  } catch (e) {
    return left(new DbError('Check login data error', e))
  }
}

export const authByProvider = async (data: AuthByProviderBody): Promise<Either<DbError, User>> => {
  const { authProvider, nickname, email } = data
  try {
    let [user, created] = await Users.findOrCreate({
      where: { email },
      defaults: { email, nickname, authProvider, isAdmin: false, status: 'active' },
    })
    if (!created && (!user.authProvider || user.authProvider !== authProvider)) {
      user = (await Users.update({ authProvider }, { where: { email }, returning: ['*'] }))[1][0]
    }
    const token = createToken(user)
    return right({ ...user.dataValues, token, password: undefined })
  } catch (e) {
    return left(new DbError('authUserByProvider: Error', e))
  }
}




