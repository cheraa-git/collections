import { Request, Response } from "express"
import { CreateItemBody, DeleteItemBody, EditItemBody } from "../../../common/request-types"
import { Items } from "../../db/models/Items"
import { checkToken, filterItem } from "../../utils"
import { ItemConfigs } from "../../db/models/ItemConfigs"
import { Collections } from "../../db/models/Collections"
import { Tags } from "../../db/models/Tags"
import { ItemsTags } from "../../db/models/ItemsTags"
import { Tag } from "../../../common/common-types"

export class ItemController {

  private createItemTags = async (tags: Tag[], itemId: number): Promise<Tag[]> => {
    const addedTags = tags.filter(tag => tag.id)
    const createdTags = (await Tags.bulkCreate(tags.filter(tag => !tag.id))).map(tag => tag.dataValues)
    const itemTags = [...addedTags, ...createdTags].map(tag => ({ itemId, tagId: tag.id }))
    await ItemsTags.bulkCreate(itemTags)
    return [...addedTags, ...createdTags]
  }

  private editItemTags = async (tags: Tag[], itemId: number) => {
    await ItemsTags.destroy({ where: { itemId } })
    await this.createItemTags(tags, itemId)
    return tags
  }

  createItem = async (req: Request<any, any, CreateItemBody>, res: Response) => {
    const { collectionId, fields, userId, token, tags } = req.body
    const name = fields.name
    if (!checkToken(token, userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    if (!collectionId || !name || !fields) {
      return res.status(500).json({ error: 'Collection data is invalid' })
    }
    const newItem = await Items.create({ collectionId, timestamp: `${Date.now()}`, ...fields })
    res.json({ ...filterItem(newItem), tags: await this.createItemTags(tags, newItem.id) })
  }

  getItem = async (req: Request, res: Response) => {
    const { id, collectionId } = req.params
    const item = await Items.findOne({ where: { id }, include: [{ model: Tags, through: { attributes: [] } }] })
    const itemConfigs = await ItemConfigs.findAll({ where: { collectionId } })
    res.json({ item: filterItem(item), itemConfigs })
  }

  editItem = async (req: Request<any, any, EditItemBody>, res: Response) => {
    const { item: { tags, ...editedItem }, token } = req.body
    const itemAuthor = await Collections.findOne({ where: { id: editedItem.collectionId }, attributes: ['userId'] })
    if (!checkToken(token, itemAuthor?.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    const updatedItem = await Items.update(editedItem, { where: { id: editedItem.id }, returning: ['*'] })
    const updatedTags = await this.editItemTags(tags, editedItem.id)
    res.json({ ...filterItem(updatedItem[1][0]), tags: updatedTags })
  }

  deleteItem = async (req: Request<any, any, DeleteItemBody>, res: Response) => {
    const { item, token } = req.body
    const itemAuthor = await Collections.findOne({ where: { id: item.collectionId }, attributes: ['userId'] })
    if (!checkToken(token, itemAuthor?.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    const countDeletedItems = await Items.destroy({ where: { id: item.id }, force: true })
    res.json(countDeletedItems)
  }

  async getTags(req: Request, res: Response) {
    const tags = await Tags.findAll()
    res.json(tags)
  }

}
