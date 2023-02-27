import { Users } from "../db/models/Users"
import { Sequelize } from "sequelize-typescript"
import { UserStatus } from "../../common/common-types"
import { Either, left, right } from "@sweet-monads/either"
import { DatabaseError } from "../../common/errors/DatabaseError"


export const getUsers = async (): Promise<Either<DatabaseError, Users[]>> => {
  try {
    return right(await Users.findAll({
      attributes: { exclude: ['password'] }, order: [Sequelize.literal('id DESC')]
    }))
  } catch (e) {
    return left(new DatabaseError('Get users error', e))
  }
}

export const setUsersStatus = async (status: UserStatus, ids: number[]): Promise<Either<DatabaseError, number[]>> => {
  try {
    return right(await Users.update({ status }, { where: { id: ids } }))
  } catch (e) {
    return left(new DatabaseError('Set users status error', e))
  }
}

export const setAdminStatus = async (status: boolean, ids: number[]) => {
  try {
    return right(await Users.update({ isAdmin: status }, { where: { id: ids } }))
  } catch (e) {
    return left(new DatabaseError('Set admin status error', e))
  }
}
