import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken"
import { Collections } from "../db/models/Collections"
import { ItemConfigs } from "../db/models/ItemConfigs"
import dotenv from "dotenv"
import {
  CreateCollectionBody,
  CreateItemBody,
  DeleteCollectionBody,
  DeleteItemBody,
  EditItemBody
} from "../../common/request-types"
import { Users } from "../db/models/Users"
import { Items } from "../db/models/Items"
import { filterItem } from "../utils"


export class CollectionController {

  private checkToken(token?: string, userId?: number): boolean {
    if (!token || !userId) return false
    dotenv.config()
    const jwtPayload = jwt.verify(token, String(process.env.TOKEN_SECTET_KEY)) as JwtPayload
    return jwtPayload.id === userId
  }

  createCollection = async (req: Request<any, any, CreateCollectionBody>, res: Response) => {
    const { userId, token, title, description, theme, imageUrl, itemConfigs } = req.body
    const timestamp = `${Date.now()}`
    if (!this.checkToken(token, userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    if (!title || !description || !theme) {
      return res.status(500).json({ error: 'Collection data is invalid' })
    }
    const newCollection = await Collections.create({ title, description, theme, userId, imageUrl, timestamp })
    if (itemConfigs && itemConfigs.length > 0) {
      const configs = itemConfigs.map(config => ({ ...config, collectionId: newCollection.id }))
      await ItemConfigs.bulkCreate(configs)
    }
    // TODO: отработать исключения при создании
    res.json({ ...newCollection.dataValues })
  }


  getCollection = async (req: Request, res: Response) => {
    const id = +req.params.id
    const response = await Collections.findOne({
      where: { id },
      include: [
        { model: ItemConfigs },
        { model: Users, attributes: ['nickname'] },
        { model: Items }
      ]
    })
    const collection = {
      ...response?.dataValues,
      userName: response?.users.nickname,
      itemConfigs: undefined,
      users: undefined,
      items: undefined
    }
    const items = response?.items.map(i => filterItem(i))
    res.json({ collection, itemConfigs: response?.itemConfigs, items })
  }
  createItem = async (req: Request<any, any, CreateItemBody>, res: Response) => {
    const { collectionId, fields, userId, token, tags } = req.body
    const name = fields.name
    //TODO: реализовать tags
    const timestamp = `${Date.now()}`
    if (!this.checkToken(token, userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    if (!collectionId || !name || !fields) {
      return res.status(500).json({ error: 'Collection data is invalid' })
    }
    const newItem = await Items.create({ collectionId, timestamp, ...fields })
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
    if (!this.checkToken(token, itemAuthor?.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    const updatedItem = await Items.update(item, { where: { id: item.id }, returning: ['*'] })
    res.json(filterItem(updatedItem[1][0]))
  }

  deleteItem = async (req: Request<any, any, DeleteItemBody>, res: Response) => {
    const { item, token } = req.body
    const itemAuthor = await Collections.findOne({ where: { id: item.collectionId }, attributes: ['userId'] })
    if (!this.checkToken(token, itemAuthor?.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    const countDeletedItems = await Items.destroy({ where: { id: item.id }, force: true })
    res.json(countDeletedItems)
  }

  deleteCollection = async (req: Request<any, any, DeleteCollectionBody>, res: Response) => {
    const { collection, token } = req.body
    if (!this.checkToken(token, collection.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }

    const countDeletedCollections = await Collections.destroy({ where: { id: collection.id }, force: true })
    res.json(countDeletedCollections)

  }
}
