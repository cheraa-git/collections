import { Request, Response } from "express"
import { checkAdminToken } from "../../utils"
import { getUsers, setAdminStatus, setUsersStatus } from "../../service/adminService"

export default class AdminController {
  handleGetUsers = async (req: Request, res: Response) => {
    res.json(await getUsers())
  }

  handleSetUsersStatus = async (req: Request, res: Response) => {
    const { token, userIds, status } = req.body
    if (!checkAdminToken(token)) res.status(500).json({ error: 'TokenError' })
    await setUsersStatus(status, userIds)
    res.json(userIds)
  }

  handleSetAdminStatus = async (req: Request, res: Response) => {
    const { token, userIds, status } = req.body
    if (!checkAdminToken(token)) res.status(500).json({ error: 'TokenError' })
    await setAdminStatus(status, userIds)
    res.json(userIds)
  }

}
