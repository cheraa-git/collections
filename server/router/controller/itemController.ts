import { Request, Response } from "express"
import { CreateItemBody, DeleteItemBody, EditItemBody } from "../../../common/request-types"
import { Items } from "../../db/models/Items"
import { checkToken, filterItem } from "../../utils"
import { ItemConfigs } from "../../db/models/ItemConfigs"
import { Collections } from "../../db/models/Collections"

export class ItemController {
  createItem = async (req: Request<any, any, CreateItemBody>, res: Response) => {
    const { collectionId, fields, userId, token, tags } = req.body
    const name = fields.name
    //TODO: реализовать tags
    if (!checkToken(token, userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    if (!collectionId || !name || !fields) {
      return res.status(500).json({ error: 'Collection data is invalid' })
    }
    const newItem = await Items.create({ collectionId, timestamp: `${Date.now()}`, ...fields })
    res.json(filterItem(newItem))
  }

  getItem = async (req: Request, res: Response) => {
    const { id, collectionId } = req.params
    const item = await Items.findOne({ where: { id } })
    const itemConfigs = await ItemConfigs.findAll({ where: { collectionId } })
    res.json({ item: filterItem(item), itemConfigs })
  }

  editItem = async (req: Request<any, any, EditItemBody>, res: Response) => {
    const { item, token } = req.body
    const itemAuthor = await Collections.findOne({ where: { id: item.collectionId }, attributes: ['userId'] })
    if (checkToken(token, itemAuthor?.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    const updatedItem = await Items.update(item, { where: { id: item.id }, returning: ['*'] })
    res.json(filterItem(updatedItem[1][0]))
  }

  deleteItem = async (req: Request<any, any, DeleteItemBody>, res: Response) => {
    const { item, token } = req.body
    const itemAuthor = await Collections.findOne({ where: { id: item.collectionId }, attributes: ['userId'] })
    if (checkToken(token, itemAuthor?.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    const countDeletedItems = await Items.destroy({ where: { id: item.id }, force: true })
    res.json(countDeletedItems)
  }


}
