import { Request, Response } from "express"
import { Users } from "../../db/models/Users"
import { checkAdminToken } from "../../utils"
import { Sequelize } from "sequelize-typescript"

export default class AdminController {
  getUsers = async (req: Request, res: Response) => {
    const users = await Users.findAll({ attributes: { exclude: ['password'] }, order: [Sequelize.literal('id DESC')] })
    res.json(users)
  }

  setStatusUsers = async (req: Request, res: Response) => {
    const { token, userIds, status } = req.body
    if (!checkAdminToken(token)) res.status(500).json({ error: 'TokenError' })
    await Users.update({ status }, { where: { id: userIds } })
    res.json(userIds)
  }

  setAdminStatus = async (req: Request, res: Response) => {
    const { token, userIds, status } = req.body
    if (!checkAdminToken(token)) res.status(500).json({ error: 'TokenError' })
    await Users.update({ isAdmin: status }, { where: { id: userIds } })
    res.json(userIds)
  }

}
