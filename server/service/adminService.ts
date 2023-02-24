import { Users } from "../db/models/Users"
import { Sequelize } from "sequelize-typescript"

export const getUsers = async () => {
  return await Users.findAll(
    {
      attributes: { exclude: ['password'] },
      order: [Sequelize.literal('id DESC')]
    }
  )
}

export const setUsersStatus = async (status: 'blocked' | 'deleted' | 'active', ids: number[]) => {
  await Users.update({ status }, { where: { id: ids } })
}

export const setAdminStatus = async (status: boolean, ids: number[]) => {
  await Users.update({ isAdmin: status }, { where: { id: ids } })
}
