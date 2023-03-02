import { Request, Response } from "express"
import { getUsers, setAdminStatus, setUsersStatus } from "../../service/adminService"
import { TokenError } from "../../../../common/errors/TokenError"
import { checkAdminToken } from "../../service/tokenService"

export default class AdminController {
  handleGetUsers = async (req: Request, res: Response) => {
    (await getUsers())
      .mapRight(users => res.json(users))
      .mapLeft(error => res.status(500).json(error))
  }

  handleSetUsersStatus = async (req: Request, res: Response) => {
    const { token, userIds, status } = req.body
    if (!checkAdminToken(token)) return res.status(498).json(new TokenError())
    const response = await setUsersStatus(status, userIds)
    response
      .mapRight(() => res.json(userIds))
      .mapLeft(e => res.status(500).json(e))
  }

  handleSetAdminStatus = async (req: Request, res: Response) => {
    const { token, userIds, status } = req.body
    if (!checkAdminToken(token)) return res.status(498).json(new TokenError())
    const response = await setAdminStatus(status, userIds)
    response
      .mapRight(() => res.json(userIds))
      .mapLeft(e => res.status(500).json(e))

  }

}
