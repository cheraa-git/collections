import { Request, Response } from "express"
import { CreateItemBody, DeleteItemBody, EditItemBody } from "../../../common/request-types"
import { checkToken } from "../../utils"
import { Tags } from "../../db/models/Tags"
import { createItem, deleteItem, editItem, getItem, getItemAuthorId } from "../../service/itemService"

export class ItemController {

  handlerCreateItem = async (req: Request<any, any, CreateItemBody>, res: Response) => {
    const { collectionId, fields, userId, token, tags } = req.body
    const name = fields.name
    if (!checkToken(token, userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    if (!collectionId || !name || !fields) {
      return res.status(500).json({ error: 'Collection data is invalid' })
    }
    const item = await createItem(userId, collectionId, fields, tags)
    res.json(item)
  }

  handleGetItem = async (req: Request, res: Response) => {
    const { id, collectionId } = req.params
    const data = getItem(+id, +collectionId)
    res.json(data)
  }

  handleEditItem = async (req: Request<any, any, EditItemBody>, res: Response) => {
    const { item, token } = req.body
    if (!checkToken(token, await getItemAuthorId(item.collectionId))) {
      return res.status(500).json({ error: 'TokenError' })
    }
    const editedItem = editItem(item)
    res.json(editedItem)
  }

  handleDeleteItem = async (req: Request<any, any, DeleteItemBody>, res: Response) => {
    const { item, token } = req.body
    if (!checkToken(token, await getItemAuthorId(item.collectionId))) {
      return res.status(500).json({ error: 'TokenError' })
    }
    res.json(await deleteItem(item.id))
  }

  async getTags(req: Request, res: Response) {
    const tags = await Tags.findAll()
    res.json(tags)
  }

}
