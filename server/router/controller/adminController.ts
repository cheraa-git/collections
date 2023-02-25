import { Request, Response } from "express"
import { checkAdminToken } from "../../utils"
import { getUsers, setAdminStatus, setUsersStatus } from "../../service/adminService"
import { indexingAllCollections, indexingAllComments, indexingAllItems } from "../../service/searchService"

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

  indexingItemsHandler = async (req: Request, res: Response) => {
    const token = req.body.token
    if (!checkAdminToken(token)) res.status(500).json({ error: 'TokenError' })
    try {
      await indexingAllItems()
      res.json({ status: 'success' })
    } catch (err) {
      console.log("IndexingItemsError:", err)
      res.status(500).json({ error: 'IndexingItemsError' })
    }
  }

  indexingCommentsHandler = async (req: Request, res: Response) => {
    const token = req.body.token
    if (!checkAdminToken(token)) res.status(500).json({ error: 'TokenError' })
    try {
      await indexingAllComments()
      res.json({ status: 'success' })
    } catch (err) {
      console.log("IndexingCommentsError:", err)
      res.status(500).json({ error: 'IndexingCommentsError' })
    }
  }

  indexingCollectionsHandler = async (req: Request, res: Response) => {
    const token = req.body.token
    if (!checkAdminToken(token)) res.status(500).json({ error: 'TokenError' })
    try {
      await indexingAllCollections()
      res.json({ status: 'success' })
    } catch (err) {
      console.log("IndexingCollectionsError:", err)
      res.status(500).json({ error: 'IndexingCollectionsError' })
    }
  }
}
