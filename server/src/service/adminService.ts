import { Users } from "../db/models/Users"
import { Sequelize } from "sequelize-typescript"
import { Either, left, right } from "@sweet-monads/either"
import { DbError } from "../../../common/errors/DbError"
import { UserStatus } from "../../../common/types/user"


export const getUsers = async (): Promise<Either<DbError, Users[]>> => {
  try {
    return right(await Users.findAll({
      attributes: { exclude: ['password'] }, order: [Sequelize.literal('id DESC')]
    }))
  } catch (e) {
    return left(new DbError('Get users error', e))
  }
}

export const setUsersStatus = async (status: UserStatus, ids: number[]): Promise<Either<DbError, number[]>> => {
  try {
    return right(await Users.update({ status }, { where: { id: ids } }))
  } catch (e) {
    return left(new DbError('Set users status error', e))
  }
}

export const setAdminStatus = async (status: boolean, ids: number[]) => {
  try {
    return right(await Users.update({ isAdmin: status }, { where: { id: ids } }))
  } catch (e) {
    return left(new DbError('Set admin status error', e))
  }
}
