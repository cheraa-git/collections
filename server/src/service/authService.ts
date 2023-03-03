import * as bcrypt from "bcrypt"
import { Users } from "../db/models/Users"
import { Either, left, right } from "@sweet-monads/either"
import { AuthorizationError } from "../../../common/errors/AuthorizationError"
import { DatabaseError } from "../../../common/errors/DatabaseError"
import { createToken } from "./tokenService"
import { User } from "../../../common/types/user"


interface RegisterUser {
  (nickname: string, email: string, password: string): Promise<Either<AuthorizationError | DatabaseError, User>>
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
      return left(new AuthorizationError(`${e.errors[0].path} already exists`))
    } else return left(new DatabaseError('Register user error', e))
  }
}

interface CheckRegisterData {
  (email: string, nickname: string): Promise<Either<AuthorizationError | DatabaseError, any>>
}

export const checkRegisterData: CheckRegisterData = async (email, nickname) => {
  try {
    const emailMach = await Users.findOne({ where: { email } })
    const nicknameMach = await Users.findOne({ where: { nickname } })
    if (emailMach) return left(new AuthorizationError(`email already exists`))
    if (nicknameMach) return left(new AuthorizationError(`nickname already exists`))
    return right('')
  } catch (e) {
    return left(new DatabaseError('checkRegisterData: Error', e))
  }
}

interface CheckLoginData {
  (email: string, password: string): Promise<Either<AuthorizationError | DatabaseError, Users>>
}

export const checkLoginData: CheckLoginData = async (email, password) => {
  try {
    const user = await Users.findOne({ where: { email } })
    if (!user) return left(new AuthorizationError('No user with this email was found'))
    if (user.status !== 'active') return left(new AuthorizationError(`The user is ${user.status}`))
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) return left(new AuthorizationError('The password is invalid'))
    return right(user.dataValues)
  } catch (e) {
    return left(new DatabaseError('Check login data error', e))
  }
}





